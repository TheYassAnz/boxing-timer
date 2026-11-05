package expo.modules.sessionnotification

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Intent
import android.content.pm.ServiceInfo
import android.graphics.Color
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat

private const val CHANNEL_ID = "timer"
private const val NOTIFICATION_ID = 4201

// mediaPlayback keeps the process (and the JS tick that rings the bell) alive while the screen is locked.
class SessionNotificationService : Service() {
  override fun onBind(intent: Intent?): IBinder? = null

  override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
    if (intent == null) {
      stopSelf()
      return START_NOT_STICKY
    }
    val manager = getSystemService(NotificationManager::class.java)
    manager.createNotificationChannel(
      NotificationChannel(CHANNEL_ID, "Minuteur", NotificationManager.IMPORTANCE_LOW).apply {
        setSound(null, null)
      }
    )

    val builder = NotificationCompat.Builder(this, CHANNEL_ID)
      .setSmallIcon(applicationInfo.icon)
      .setContentTitle(intent.getStringExtra("title"))
      .setContentText(intent.getStringExtra("text"))
      .setColor(Color.parseColor(intent.getStringExtra("color")))
      .setColorized(true)
      .setOngoing(true)
      .setOnlyAlertOnce(true)
      .setCategory(NotificationCompat.CATEGORY_PROGRESS)
      .setForegroundServiceBehavior(NotificationCompat.FOREGROUND_SERVICE_IMMEDIATE)

    packageManager.getLaunchIntentForPackage(packageName)?.let {
      builder.setContentIntent(
        PendingIntent.getActivity(this, 0, it, PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT)
      )
    }

    if (intent.hasExtra("endsAt")) {
      builder.setShowWhen(true)
        .setUsesChronometer(true)
        .setChronometerCountDown(true)
        .setWhen(intent.getLongExtra("endsAt", 0L))
    } else {
      builder.setShowWhen(false)
    }

    val notification = builder.build()
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
      startForeground(NOTIFICATION_ID, notification, ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK)
    } else {
      startForeground(NOTIFICATION_ID, notification)
    }
    return START_NOT_STICKY
  }

  override fun onDestroy() {
    stopForeground(STOP_FOREGROUND_REMOVE)
    super.onDestroy()
  }
}
