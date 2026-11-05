package expo.modules.sessionnotification

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.pm.ServiceInfo
import android.graphics.Color
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat

private const val CHANNEL_ID = "timer"
internal const val NOTIFICATION_ID = 4201

internal fun buildNotification(context: Context, title: String?, text: String?, endsAt: Long?, color: String?): Notification {
  context.getSystemService(NotificationManager::class.java).createNotificationChannel(
    NotificationChannel(CHANNEL_ID, "Minuteur", NotificationManager.IMPORTANCE_LOW).apply {
      setSound(null, null)
    }
  )

  val builder = NotificationCompat.Builder(context, CHANNEL_ID)
    .setSmallIcon(context.applicationInfo.icon)
    .setContentTitle(title)
    .setContentText(text)
    .setColor(Color.parseColor(color))
    .setColorized(true)
    .setOngoing(true)
    .setOnlyAlertOnce(true)
    .setCategory(NotificationCompat.CATEGORY_PROGRESS)
    .setForegroundServiceBehavior(NotificationCompat.FOREGROUND_SERVICE_IMMEDIATE)

  context.packageManager.getLaunchIntentForPackage(context.packageName)?.let {
    builder.setContentIntent(
      PendingIntent.getActivity(context, 0, it, PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT)
    )
  }

  if (endsAt != null) {
    builder.setShowWhen(true)
      .setUsesChronometer(true)
      .setChronometerCountDown(true)
      .setWhen(endsAt)
  } else {
    builder.setShowWhen(false)
  }

  return builder.build()
}

// mediaPlayback keeps the process alive with the screen locked; the module's headless task keeps the JS timers ticking.
class SessionNotificationService : Service() {
  override fun onBind(intent: Intent?): IBinder? = null

  override fun onCreate() {
    super.onCreate()
    running = true
  }

  override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
    if (intent == null) {
      stopSelf()
      return START_NOT_STICKY
    }
    val notification = buildNotification(
      this,
      intent.getStringExtra("title"),
      intent.getStringExtra("text"),
      if (intent.hasExtra("endsAt")) intent.getLongExtra("endsAt", 0L) else null,
      intent.getStringExtra("color"),
    )
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
      startForeground(NOTIFICATION_ID, notification, ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK)
    } else {
      startForeground(NOTIFICATION_ID, notification)
    }
    return START_NOT_STICKY
  }

  override fun onDestroy() {
    running = false
    stopForeground(STOP_FOREGROUND_REMOVE)
    super.onDestroy()
  }

  companion object {
    @Volatile
    var running = false
      internal set
  }
}
