
export enum PlayModeProgressValues {
    Unplayed = "Unplayed", // Not even started or wanting to start again
    Uninterested = "Uninterested", // This group is uninterested in playing this mode.
    Playing = "Playing", // Currently in progress
    Paused = "Paused", // Put to one side with the intent to come back
    Finished = "Finished", // Completed and generally enjoyed
    Abandoned = "Abandoned", // Abandoned because it wasn't any good.
}
