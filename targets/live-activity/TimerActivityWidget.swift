import ActivityKit
import SwiftUI
import WidgetKit

private extension TimerAttributes.ContentState {
  var color: Color {
    isRest
      ? Color(red: 52 / 255, green: 199 / 255, blue: 89 / 255)
      : Color(red: 1, green: 59 / 255, blue: 48 / 255)
  }
}

private struct Countdown: View {
  let state: TimerAttributes.ContentState

  var body: some View {
    if let endsAt = state.endsAt {
      // A past endsAt would make an invalid range and crash the widget.
      Text(timerInterval: Date.now...max(endsAt, Date.now), countsDown: true)
        .monospacedDigit()
        .multilineTextAlignment(.trailing)
    } else {
      Text(state.pausedText ?? "").monospacedDigit()
    }
  }
}

private struct Dot: View {
  let color: Color

  var body: some View {
    Circle().fill(color).frame(width: 12, height: 12)
  }
}

struct TimerActivityWidget: Widget {
  var body: some WidgetConfiguration {
    ActivityConfiguration(for: TimerAttributes.self) { context in
      let state = context.state
      HStack {
        VStack(alignment: .leading, spacing: 4) {
          Text(state.title).font(.headline).foregroundStyle(.white)
          Text(state.phaseLabel).font(.subheadline.bold()).foregroundStyle(state.color)
        }
        Spacer()
        VStack(alignment: .trailing, spacing: 2) {
          Countdown(state: state)
            .font(.system(size: 44, weight: .bold, design: .monospaced))
            .foregroundStyle(.white)
          if state.endsAt == nil {
            Text("En pause").font(.caption).foregroundStyle(.white.opacity(0.7))
          }
        }
      }
      .padding()
      .activityBackgroundTint(.black)
      .activitySystemActionForegroundColor(.white)
    } dynamicIsland: { context in
      let state = context.state
      return DynamicIsland {
        DynamicIslandExpandedRegion(.leading) {
          VStack(alignment: .leading, spacing: 2) {
            Text(state.title).font(.headline)
            Text(state.phaseLabel).font(.subheadline.bold()).foregroundStyle(state.color)
          }
        }
        DynamicIslandExpandedRegion(.trailing) {
          Countdown(state: state).font(.title.bold())
        }
      } compactLeading: {
        Dot(color: state.color)
      } compactTrailing: {
        Countdown(state: state).frame(maxWidth: 48)
      } minimal: {
        Dot(color: state.color)
      }
    }
  }
}
