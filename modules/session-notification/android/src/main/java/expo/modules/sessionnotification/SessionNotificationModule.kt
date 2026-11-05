package expo.modules.sessionnotification

import android.content.Intent
import androidx.core.content.ContextCompat
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class SessionNotificationModule : Module() {
  private val context
    get() = requireNotNull(appContext.reactContext)

  override fun definition() = ModuleDefinition {
    Name("SessionNotification")

    Function("show") { title: String, text: String, endsAt: Double?, color: String ->
      val intent = Intent(context, SessionNotificationService::class.java)
        .putExtra("title", title)
        .putExtra("text", text)
        .putExtra("color", color)
      if (endsAt != null) intent.putExtra("endsAt", endsAt.toLong())
      ContextCompat.startForegroundService(context, intent)
    }

    Function("hide") {
      context.stopService(Intent(context, SessionNotificationService::class.java))
    }
  }
}
