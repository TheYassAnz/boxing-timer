package expo.modules.sessionnotification

import android.annotation.SuppressLint
import android.content.Intent
import androidx.core.app.NotificationManagerCompat
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.UiThreadUtil
import com.facebook.react.jstasks.HeadlessJsTaskConfig
import com.facebook.react.jstasks.HeadlessJsTaskContext
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class SessionNotificationModule : Module() {
  private val context
    get() = requireNotNull(appContext.reactContext) as ReactContext

  // Only touched on the UI thread.
  private var keepAliveTaskId: Int? = null

  @SuppressLint("MissingPermission")
  override fun definition() = ModuleDefinition {
    Name("SessionNotification")

    Function("show") { title: String, text: String, endsAt: Double?, color: String ->
      // Android 12+ refuses startForegroundService from the background, so only start it once.
      if (SessionNotificationService.running) {
        NotificationManagerCompat.from(context)
          .notify(NOTIFICATION_ID, buildNotification(context, title, text, endsAt?.toLong(), color))
      } else {
        val intent = Intent(context, SessionNotificationService::class.java)
          .putExtra("title", title)
          .putExtra("text", text)
          .putExtra("color", color)
        if (endsAt != null) intent.putExtra("endsAt", endsAt.toLong())
        ContextCompat.startForegroundService(context, intent)
      }
      // JavaTimerManager drops JS timers on onHostPause unless a headless task is active.
      UiThreadUtil.runOnUiThread {
        if (keepAliveTaskId == null) {
          keepAliveTaskId = HeadlessJsTaskContext.getInstance(context)
            .startTask(HeadlessJsTaskConfig(KEEP_ALIVE_TASK, Arguments.createMap(), 0, true))
        }
      }
    }

    Function("hide") {
      // Cleared now, not in onDestroy, so a show() right after hide() restarts the service instead of notifying into a dying one.
      SessionNotificationService.running = false
      context.stopService(Intent(context, SessionNotificationService::class.java))
      UiThreadUtil.runOnUiThread {
        keepAliveTaskId?.let { HeadlessJsTaskContext.getInstance(context).finishTask(it) }
        keepAliveTaskId = null
      }
    }
  }

  private companion object {
    const val KEEP_ALIVE_TASK = "TimerKeepAlive"
  }
}
