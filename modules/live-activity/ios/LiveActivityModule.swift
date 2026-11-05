import ActivityKit
import ExpoModulesCore

struct LiveActivityState: Record {
  @Field var title: String = ""
  @Field var phaseLabel: String = ""
  @Field var isRest: Bool = false
  @Field var endsAt: Double?
  @Field var pausedText: String?

  var content: ActivityContent<TimerAttributes.ContentState> {
    ActivityContent(
      state: TimerAttributes.ContentState(
        title: title,
        phaseLabel: phaseLabel,
        isRest: isRest,
        endsAt: endsAt.map { Date(timeIntervalSince1970: $0 / 1000) },
        pausedText: pausedText
      ),
      staleDate: nil
    )
  }
}

public class LiveActivityModule: Module {
  private var current: Activity<TimerAttributes>?

  public func definition() -> ModuleDefinition {
    Name("LiveActivity")

    AsyncFunction("start") { (state: LiveActivityState) async in
      await self.start(state)
    }

    AsyncFunction("update") { (state: LiveActivityState) async in
      if let current = self.current, current.activityState == .active {
        await current.update(state.content)
      } else {
        await self.start(state)
      }
    }

    AsyncFunction("end") { () async in
      await self.current?.end(nil, dismissalPolicy: .immediate)
      self.current = nil
    }
  }

  private func start(_ state: LiveActivityState) async {
    for activity in Activity<TimerAttributes>.activities {
      await activity.end(nil, dismissalPolicy: .immediate)
    }
    current = nil
    guard ActivityAuthorizationInfo().areActivitiesEnabled else { return }
    current = try? Activity.request(attributes: TimerAttributes(), content: state.content, pushType: nil)
  }
}
