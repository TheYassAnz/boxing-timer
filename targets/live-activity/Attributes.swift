import ActivityKit
import Foundation

// Duplicated in modules/live-activity/ios: ActivityKit matches the app and widget types by name.
struct TimerAttributes: ActivityAttributes {
  struct ContentState: Codable, Hashable {
    var title: String
    var phaseLabel: String
    var isRest: Bool
    var endsAt: Date?
    var pausedText: String?
  }
}
