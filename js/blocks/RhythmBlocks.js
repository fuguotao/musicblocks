function setupRhythmBlocks() {
    class MyNoteValueBlock extends ValueBlock {
        constructor() {
            //.TRANS: the value (e.g., 1/4 note) of the note being played.
            super("mynotevalue", _("note value"));
            this.setPalette("rhythm");
            this.parameter = true;
            this.beginnerBlock(true);
            this.setHelpString([
                _(
                    "The Note value block is the value of the duration of the note currently being played."
                ),
                "documentation",
                null,
                "everybeathelp"
            ]);
        }

        updateParameter(logo, turtle, blk) {
            return mixedNumber(logo.blocks.blockList[blk].value);
        }

        arg(logo, turtle, blk) {
            if (
                logo.inStatusMatrix &&
                logo.blocks.blockList[logo.blocks.blockList[blk].connections[0]]
                    .name === "print"
            ) {
                logo.statusFields.push([blk, "mynotevalue"]);
            } else {
                let value = 0;
                if (
                    logo.noteValue[turtle][last(logo.inNoteBlock[turtle])] !==
                        null &&
                    logo.noteValue[turtle][last(logo.inNoteBlock[turtle])] !==
                        undefined
                ) {
                    if (
                        logo.noteValue[turtle][
                            last(logo.inNoteBlock[turtle])
                        ] !== 0
                    ) {
                        value =
                            1 /
                            logo.noteValue[turtle][
                                last(logo.inNoteBlock[turtle])
                            ];
                    } else {
                        value = 0;
                    }
                } else if (logo.lastNotePlayed[turtle] !== null) {
                    value = logo.lastNotePlayed[turtle][1];
                } else if (
                    logo.notePitches[turtle][last(logo.inNoteBlock[turtle])] !==
                        undefined &&
                    logo.notePitches[turtle][last(logo.inNoteBlock[turtle])]
                        .length > 0
                ) {
                    value =
                        logo.noteBeat[turtle][last(logo.inNoteBlock[turtle])];
                } else {
                    console.debug("Cannot find a note for turtle " + turtle);
                    value = 0;
                }

                if (value !== 0) return 1 / value;
                return 0;
            }
        }
    }

    class SkipFactorBlock extends ValueBlock {
        constructor() {
            super("skipfactor", "skip factor");
            this.setPalette("rhythm");
            this.setHelpString();
            this.parameter = true;
            this.hidden = true;
        }

        updateParameter(logo, turtle, blk) {
            return logo.blocks.blockList[blk].value;
        }

        arg(logo, turtle, blk) {
            if (
                logo.inStatusMatrix &&
                logo.blocks.blockList[logo.blocks.blockList[blk].connections[0]]
                    .name === "print"
            ) {
                logo.statusFields.push([blk, "skip"]);
            } else {
                return logo.skipFactor[turtle];
            }
        }
    }

    class MillisecondsBlock extends FlowClampBlock {
        constructor() {
            super("osctime");
            this.setPalette("rhythm");
            this.setHelpString([
                _(
                    "The Milliseconds block is similar to a Note block except that it uses time (in MS) to specify the note duration."
                ),
                "documentation",
                null,
                "osctimehelp"
            ]);

            this.formBlock({
                name: _("milliseconds"),
                args: 1,
                defaults: [200],
                canCollapse: true
            });

            this.makeMacro((x, y) => [
                [0, "osctime", x, y, [null, 2, 1, 7]],
                [1, "vspace", 0, 0, [0, 5]],
                [2, "divide", 0, 0, [0, 3, 4]],
                [3, ["number", { value: 1000 }], 0, 0, [2]],
                [4, "divide", 0, 0, [2, 8, 9]],
                [5, "hertz", 0, 0, [1, 6, null]],
                [6, ["number", { value: 392 }], 0, 0, [5]],
                [7, "hidden", 0, 0, [0, null]],
                [8, ["number", { value: 3 }], 0, 0, [4]],
                [9, ["number", { value: 2 }], 0, 0, [4]]
            ]);
        }

        flow(args, logo, turtle, blk, receivedArg) {
            return NoteController._playNote(args, logo, turtle, blk, receivedArg);
        }
    }

    class SwingBlock extends FlowClampBlock {
        constructor() {
            super("swing");
            this.setPalette("rhythm");
            this.setHelpString();

            this.formBlock({
                name: _("swing"),
                args: 1,
                defaults: [32]
            });
            this.makeMacro((x, y) => [
                [0, "swing", x, y, [null, 1, null, 2]],
                [1, ["number", { value: 32 }], 0, 0, [0]],
                [2, "hidden", 0, 0, [0, null]]
            ]);
            this.hidden = true;
        }

        flow(args, logo, turtle, blk) {
            return NoteController._playSwing(args, logo, turtle, blk);
        }
    }

    class NewSwingBlock extends FlowClampBlock {
        constructor() {
            super("newswing");
            this.setPalette("rhythm");
            this.setHelpString();

            this.formBlock({
                //.TRANS: swing is a rhythmic variation that emphasises the offbeat
                name: _("swing"),
                args: 1,
                defaults: [1 / 24]
            });
            this.makeMacro((x, y) => [
                [0, "newswing", x, y, [null, 1, 4, 5]],
                [1, "divide", 0, 0, [0, 2, 3]],
                [2, ["number", { value: 1 }], 0, 0, [1]],
                [3, ["number", { value: 16 }], 0, 0, [1]],
                [4, "vspace", 0, 0, [0, null]],
                [5, "hidden", 0, 0, [0, null]]
            ]);
            this.hidden = true;
        }

        flow(args, logo, turtle, blk) {
            return NoteController._playSwing(args, logo, turtle, blk);
        }
    }

    class NewSwing2Block extends FlowClampBlock {
        constructor() {
            super("newswing2");
            this.setPalette("rhythm");
            this.setHelpString([
                _(
                    "The Swing block works on pairs of notes (specified by note value), adding some duration (specified by swing value) to the first note and taking the same amount from the second note."
                ),
                "documentation",
                null,
                "swinghelp"
            ]);

            this.formBlock({
                name: _("swing"),
                args: 2,
                defaults: [1 / 24, 1 / 8],
                argLabels: [
                    //.TRANS: the amount to shift to the offbeat note
                    _("swing value"),
                    _("note value")
                ],
                canCollapse: true
            });
            this.makeMacro((x, y) => [
                [0, "newswing2", x, y, [null, 1, 6, 9, 10]],
                [1, "hspace", 0, 0, [0, 2]],
                [2, "hspace", 0, 0, [1, 3]],
                [3, "divide", 0, 0, [2, 4, 5]],
                [4, ["number", { value: 1 }], 0, 0, [3]],
                [5, ["number", { value: 24 }], 0, 0, [3]],
                [6, "divide", 0, 0, [0, 7, 8]],
                [7, ["number", { value: 1 }], 0, 0, [6]],
                [8, ["number", { value: 8 }], 0, 0, [6]],
                [9, "vspace", 0, 0, [0, null]],
                [10, "hidden", 0, 0, [0, null]]
            ]);
        }

        flow(args, logo, turtle, blk) {
            return NoteController._playSwing(args, logo, turtle, blk);
        }
    }

    class SkipNotesBlock extends FlowClampBlock {
        constructor() {
            super("skipnotes");
            this.setPalette("rhythm");
            this.setHelpString([
                _("The Skip notes block will cause notes to be skipped."),
                "documentation",
                null,
                "skiphelp"
            ]);

            this.formBlock({
                //.TRANS: substitute rests on notes being skipped
                name: _("skip notes"),
                args: 1,
                defaults: [2],
                canCollapse: true
            });
            this.makeMacro((x, y) => [
                [0, "skipnotes", x, y, [null, 1, null, 2]],
                [1, ["number", { value: 2 }], 0, 0, [0]],
                [2, "hidden", 0, 0, [0, null]]
            ]);
        }
    }

    class MultiplyBeatFactorBlock extends FlowClampBlock {
        constructor() {
            super("multiplybeatfactor");
            this.setPalette("rhythm");
            this.setHelpString([
                _(
                    "The Multiply note value block changes the duration of notes by changing their note values."
                ),
                "documentation",
                null,
                "multiplybeathelp"
            ]);

            this.formBlock({
                //.TRANS: speed up note duration by some factor, e.g. convert 1/4 to 1/8 notes by using a factor of 2
                name: _("multiply note value"),
                args: 1,
                defaults: [2],
                canCollapse: true
            });
            this.makeMacro((x, y) => [
                [0, "multiplybeatfactor", x, y, [null, 1, 4, 5]],
                [1, "divide", 0, 0, [0, 2, 3]],
                [2, ["number", { value: 1 }], 0, 0, [1]],
                [3, ["number", { value: 2 }], 0, 0, [1]],
                [4, "vspace", 0, 0, [0, null]],
                [5, "hidden", 0, 0, [0, null]]
            ]);
        }

        flow(args, logo, turtle, blk) {
            if (args[1] === undefined) {
                // Nothing to do.
                return;
            }

            let factor;
            if (
                args[0] === null ||
                typeof args[0] !== "number" ||
                args[0] <= 0
            ) {
                logo.errorMsg(NOINPUTERRORMSG, blk);
                factor = 2;
            } else {
                factor = args[0];
            }

            logo.beatFactor[turtle] /= factor;

            let listenerName = "_multiplybeat_" + turtle;
            logo._setDispatchBlock(blk, turtle, listenerName);

            let __listener = function(event) {
                logo.beatFactor[turtle] *= factor;
            };

            logo._setListener(turtle, listenerName, __listener);

            return [args[1], 1];
        }
    }

    class TieBlock extends FlowClampBlock {
        constructor() {
            super("tie");
            this.setPalette("rhythm");

            this.beginnerBlock(true);
            this.setHelpString([
                _(
                    "The Tie block works on pairs of notes, combining them into one note."
                ),
                "documentation",
                null,
                "tiehelp"
            ]);

            this.formBlock({
                //.TRANS: tie notes together into one longer note
                name: _("tie"),
                canCollapse: true
            });
            this.makeMacro((x, y) => [
                [0, "tie", x, y, [null, null, 1]],
                [1, "hidden", 0, 0, [0, null]]
            ]);
        }

        flow(args, logo, turtle, blk, receivedArg, actionArgs, isflow) {
            if (args[0] === undefined) {
                // Nothing to do.
                return;
            }

            // Tie notes together in pairs.
            logo.tie[turtle] = true;
            logo.tieNotePitches[turtle] = [];
            logo.tieNoteExtras[turtle] = [];
            logo.tieCarryOver[turtle] = 0;
            logo.tieFirstDrums[turtle] = [];

            let listenerName = "_tie_" + turtle;
            logo._setDispatchBlock(blk, turtle, listenerName);

            let __listener = function(event) {
                logo.tie[turtle] = false;

                // If tieCarryOver > 0, we have one more note to
                // play.
                if (logo.tieCarryOver[turtle] > 0) {
                    if (logo.justCounting[turtle].length === 0) {
                        let lastNote = last(logo.inNoteBlock[turtle]);
                        if (
                            lastNote != null &&
                            lastNote in logo.notePitches[turtle]
                        ) {
                            // Remove the note from the Lilypond list.
                            for (
                                let i = 0;
                                i <
                                logo.notePitches[turtle][
                                    last(logo.inNoteBlock[turtle])
                                ].length;
                                i++
                            ) {
                                logo.notationRemoveTie(turtle);
                            }
                        }
                    }

                    // Restore the extra note and play it
                    let saveBlk = logo.tieNoteExtras[turtle][0];
                    let noteValue = logo.tieCarryOver[turtle];
                    logo.tieCarryOver[turtle] = 0;

                    logo.inNoteBlock[turtle].push(saveBlk);

                    logo.notePitches[turtle][saveBlk] = [];
                    logo.noteOctaves[turtle][saveBlk] = [];
                    logo.noteCents[turtle][saveBlk] = [];
                    logo.noteHertz[turtle][saveBlk] = [];
                    for (
                        let i = 0;
                        i < logo.tieNotePitches[turtle].length;
                        i++
                    ) {
                        logo.notePitches[turtle][saveBlk].push(
                            logo.tieNotePitches[turtle][i][0]
                        );
                        logo.noteOctaves[turtle][saveBlk].push(
                            logo.tieNotePitches[turtle][i][1]
                        );
                        logo.noteCents[turtle][saveBlk].push(
                            logo.tieNotePitches[turtle][i][2]
                        );
                        logo.noteHertz[turtle][saveBlk].push(
                            logo.tieNotePitches[turtle][i][3]
                        );
                    }

                    logo.oscList[turtle][saveBlk] =
                        logo.tieNoteExtras[turtle][1];
                    logo.noteBeat[turtle][saveBlk] =
                        logo.tieNoteExtras[turtle][2];
                    logo.noteBeatValues[turtle][saveBlk] =
                        logo.tieNoteExtras[turtle][3];
                    logo.noteDrums[turtle][saveBlk] =
                        logo.tieNoteExtras[turtle][4];
                    // Graphics will have already been rendered.
                    logo.embeddedGraphics[turtle][saveBlk] = [];

                    NoteController._processNote(logo, noteValue, saveBlk, turtle);
                    let bpmFactor;
                    if (logo.bpm[turtle].length > 0) {
                        bpmFactor = TONEBPM / last(logo.bpm[turtle]);
                    } else {
                        bpmFactor = TONEBPM / logo._masterBPM;
                    }

                    // Wait until this note is played before continuing.
                    logo._doWait(turtle, bpmFactor / noteValue);

                    logo.inNoteBlock[turtle].pop();

                    delete logo.notePitches[turtle][saveBlk];
                    delete logo.noteOctaves[turtle][saveBlk];
                    delete logo.noteCents[turtle][saveBlk];
                    delete logo.noteHertz[turtle][saveBlk];
                    delete logo.oscList[turtle][saveBlk];
                    delete logo.noteBeat[turtle][saveBlk];
                    delete logo.noteBeatValues[turtle][saveBlk];
                    delete logo.noteDrums[turtle][saveBlk];
                    delete logo.embeddedGraphics[turtle][saveBlk];

                    // Remove duplicate note
                    logo.notationStaging[turtle].pop();
                }

                logo.tieNotePitches[turtle] = [];
                logo.tieNoteExtras[turtle] = [];
            };

            logo._setListener(turtle, listenerName, __listener);

            return [args[0], 1];
        }
    }

    class RhythmicDotBlock extends FlowClampBlock {
        constructor() {
            super("rhythmicdot");
            this.setPalette("rhythm");
            this.setHelpString();

            this.formBlock({
                name: _("dot"),
                canCollapse: true
            });
            this.makeMacro((x, y) => [
                [0, "rhythmicdot", x, y, [null, null, 1]],
                [1, "hidden", 0, 0, [0, null]]
            ]);
            this.hidden = true;
            this.deprecated = true;
        }

        flow(args, logo, turtle, blk) {
            return NoteController._playDotted(args, logo, turtle, blk);
        }
    }

    class RhythmicDot2Block extends FlowClampBlock {
        constructor() {
            super("rhythmicdot2");
            this.setPalette("rhythm");
            this.setHelpString([
                _("The Dot block extends the duration of a note by 50%.") +
                    " " +
                    _(
                        "Eg a dotted quarter note will play for 3/8 (1/4 + 1/8) of a beat."
                    ),
                "documentation",
                null,
                "dothelp"
            ]);

            this.formBlock({
                //.TRANS: a dotted note is played for 1.5x its value, e.g., 1/8. --> 3/16
                name: _("dot"),
                args: 1,
                defaults: [1],
                canCollapse: true
            });
            this.makeMacro((x, y) => [
                [0, "rhythmicdot2", x, y, [null, 1, null, 2]],
                [1, ["number", { value: 1 }], 0, 0, [0]],
                [2, "hidden", 0, 0, [0, null]]
            ]);
        }

        flow(args, logo, turtle, blk) {
            return NoteController._playDotted(args, logo, turtle, blk);
        }
    }

    class Rest2Block extends FlowBlock {
        constructor() {
            super("rest2", _("silence"));
            this.setPalette("rhythm");
            this.beginnerBlock(true);
            this.setHelpString([
                _(
                    "A rest of the specified note value duration can be constructed using a Silence block."
                ),
                "documentation",
                null,
                "rest2"
            ]);

            this.makeMacro((x, y) => [
                [0, "newnote", x, y, [null, 1, 4, 6]],
                [1, "divide", 0, 0, [0, 2, 3]],
                [2, ["number", { value: 1 }], 0, 0, [1]],
                [3, ["number", { value: 4 }], 0, 0, [1]],
                [4, "vspace", 0, 0, [0, 5]],
                [5, "rest2", 0, 0, [4, null]],
                [6, "hidden", 0, 0, [0, null]]
            ]);
        }

        flow(args, logo, turtle) {
            if (logo.inNoteBlock[turtle].length > 0) {
                logo.notePitches[turtle][last(logo.inNoteBlock[turtle])].push(
                    "rest"
                );
                logo.noteOctaves[turtle][last(logo.inNoteBlock[turtle])].push(
                    4
                );
                logo.noteCents[turtle][last(logo.inNoteBlock[turtle])].push(0);
                logo.noteHertz[turtle][last(logo.inNoteBlock[turtle])].push(0);
                logo.noteBeatValues[turtle][last(logo.inNoteBlock[turtle])]
                    .push(logo.beatFactor[turtle]);
                logo.pushedNote[turtle] = true;
            }
        }
    }

    class Note4Block extends FlowClampBlock {
        constructor() {
            super("note4");
            this.setPalette("rhythm");
            this.beginnerBlock(true);

            this.formBlock({
                name:
                    this.lang === "ja"
                        ? //.TRANS: Japanese only: note value block for drum
                          _("note value drum")
                        : _("note value") + " " + _("drum"),
                args: 1,
                canCollapse: true
            });
            this.makeMacro((x, y) => [
                [0, "newnote", x, y, [null, 1, 4, 7]],
                [1, "divide", 0, 0, [0, 2, 3]],
                [2, ["number", { value: 1 }], 0, 0, [1]],
                [3, ["number", { value: 4 }], 0, 0, [1]],
                [4, "vspace", 0, 0, [0, 5]],
                [5, "playdrum", 0, 0, [4, 6, null]],
                [6, ["drumname", { value: DEFAULTDRUM }], 0, 0, [5]],
                [7, "hidden", 0, 0, [0, null]]
            ]);
        }

        flow(args, logo, turtle, blk, receivedArg, actionArgs, isflow) {}
    }

    class _NoteValueBlock extends FlowClampBlock {
        constructor(name, value) {
            super(name);
            this.setPalette("rhythm");
            this.setHelpString();

            this.formBlock({
                name: _("note value") + " " + value,
                args: 1,
                canCollapse: true
            });
        }

        flow(args, logo, turtle, blk, receivedArg, actionArgs, isflow) {}
    }

    class Note3Block extends _NoteValueBlock {
        constructor() {
            super("note3", _("392 hertz"));
            this.setHelpString();
            this.makeMacro((x, y) => [
                [0, "newnote", x, y, [null, 1, 4, 7]],
                [1, "divide", 0, 0, [0, 2, 3]],
                [2, ["number", { value: 1 }], 0, 0, [1]],
                [3, ["number", { value: 4 }], 0, 0, [1]],
                [4, "vspace", 0, 0, [0, 5]],
                [5, "hertz", 0, 0, [4, 6, null]],
                [6, ["number", { value: 392 }], 0, 0, [5]],
                [7, "hidden", 0, 0, [0, null]]
            ]);
        }

        flow(args, logo, turtle, blk, receivedArg, actionArgs, isflow) {}
    }

    class Note5Block extends _NoteValueBlock {
        constructor() {
            super("note5", "7");
            this.setHelpString();
            this.makeMacro((x, y) => [
                [0, "newnote", x, y, [null, 1, 4, 7]],
                [1, "divide", 0, 0, [0, 2, 3]],
                [2, ["number", { value: 1 }], 0, 0, [1]],
                [3, ["number", { value: 4 }], 0, 0, [1]],
                [4, "vspace", 0, 0, [0, 5]],
                [5, "pitchnumber", 0, 0, [4, 6, null]],
                [6, ["number", { value: 7 }], 0, 0, [5]],
                [7, "hidden", 0, 0, [0, null]]
            ]);
        }

        flow(args, logo, turtle, blk, receivedArg, actionArgs, isflow) {}
    }

    class Note7Block extends _NoteValueBlock {
        constructor() {
            super("note7", "4 4");
            this.setHelpString();
            this.makeMacro((x, y) => [
                [0, "newnote", x, y, [null, 1, 4, 8]],
                [1, "divide", 0, 0, [0, 2, 3]],
                [2, ["number", { value: 1 }], 0, 0, [1]],
                [3, ["number", { value: 4 }], 0, 0, [1]],
                [4, "vspace", 0, 0, [0, 5]],
                [5, "nthmodalpitch", 0, 0, [4, 6, 7, null]],
                [6, ["number", { value: 4 }], 0, 0, [5]],
                [7, ["number", { value: 4 }], 0, 0, [5]],
                [8, "hidden", 0, 0, [0, null]]
            ]);
        }

        flow(args, logo, turtle, blk, receivedArg, actionArgs, isflow) {}
    }

    class Note8Block extends _NoteValueBlock {
        constructor() {
            super("note8", "scale degree");
            this.setHelpString();
            this.makeMacro((x, y) => [
                [0, "newnote", x, y, [null, 1, 4, 8]],
                [1, "divide", 0, 0, [0, 2, 3]],
                [2, ["number", { value: 1 }], 0, 0, [1]],
                [3, ["number", { value: 4 }], 0, 0, [1]],
                [4, "vspace", 0, 0, [0, 5]],
                [5, "pitch", 0, 0, [4, 6, 7, null]],
                [6, ["scaledegree2", { value: "5" }], 0, 0, [5]],
                [7, ["number", { value: 4 }], 0, 0, [5]],
                [8, "hidden", 0, 0, [0, null]]
            ]);
        }

        flow(args, logo, turtle, blk, receivedArg, actionArgs, isflow) {}
    }

    class Note6Block extends _NoteValueBlock {
        constructor() {
            super("note6", "+1");
            this.setHelpString();
            this.makeMacro((x, y) => [
                [0, "newnote", x, y, [null, 1, 4, 7]],
                [1, "divide", 0, 0, [0, 2, 3]],
                [2, ["number", { value: 1 }], 0, 0, [1]],
                [3, ["number", { value: 4 }], 0, 0, [1]],
                [4, "vspace", 0, 0, [0, 5]],
                [5, "steppitch", 0, 0, [4, 6, null]],
                [6, ["number", { value: 1 }], 0, 0, [5]],
                [7, "hidden", 0, 0, [0, null]]
            ]);
        }

        flow(args, logo, turtle, blk, receivedArg, actionArgs, isflow) {}
    }

    class Note2Block extends _NoteValueBlock {
        constructor() {
            super("note2", "G4");
            this.setHelpString();
            this.makeMacro((x, y) => [
                [0, "newnote", x, y, [null, 1, 4, 8]],
                [1, "divide", 0, 0, [0, 2, 3]],
                [2, ["number", { value: 1 }], 0, 0, [1]],
                [3, ["number", { value: 4 }], 0, 0, [1]],
                [4, "vspace", 0, 0, [0, 5]],
                [5, "pitch", 0, 0, [4, 6, 7, null]],
                [6, ["notename", { value: "G" }], 0, 0, [5]],
                [7, ["number", { value: 4 }], 0, 0, [5]],
                [8, "hidden", 0, 0, [0, null]]
            ]);
        }

        flow(args, logo, turtle, blk, receivedArg, actionArgs, isflow) {}
    }

    class Note1Block extends _NoteValueBlock {
        constructor() {
            super("note1", i18nSolfege("sol") + "4");
            this.setHelpString();
            this.makeMacro((x, y) => [
                [0, "newnote", x, y, [null, 1, 4, 8]],
                [1, "divide", 0, 0, [0, 2, 3]],
                [2, ["number", { value: 1 }], 0, 0, [1]],
                [3, ["number", { value: 4 }], 0, 0, [1]],
                [4, "vspace", 0, 0, [0, 5]],
                [5, "pitch", 0, 0, [4, 6, 7, null]],
                [6, ["solfege", { value: "sol" }], 0, 0, [5]],
                [7, ["number", { value: 4 }], 0, 0, [5]],
                [8, "hidden", 0, 0, [0, null]]
            ]);
        }

        flow(args, logo, turtle, blk, receivedArg, actionArgs, isflow) {}
    }

    class NoteBlock extends FlowClampBlock {
        constructor() {
            super("note");
            this.setPalette("rhythm");
            this.setHelpString();

            this.formBlock({
                name: "deprecated note value",
                args: 1,
                defaults: [4],
                canCollapse: true
            });
            this.makeMacro((x, y) => [
                [0, "newnote", x, y, [null, 1, 2, 5]],
                [1, ["number", { value: 8 }], 0, 0, [0]],
                [2, "pitch", 0, 0, [0, 3, 4, null]],
                [3, ["solfege", { value: "sol" }], 0, 0, [2]],
                [4, ["number", { value: 4 }], 0, 0, [2]],
                [5, "hidden", 0, 0, [0, null]]
            ]);
            this.hidden = true;
            this.deprecated = true;
        }

        flow(args, logo, turtle, blk, receivedArg) {
            return NoteController._playNote(args, logo, turtle, blk, receivedArg);
        }
    }

    class NewNoteBlock extends FlowClampBlock {
        constructor() {
            super("newnote");
            this.setPalette("rhythm");
            this.beginnerBlock(true);
            this.setHelpString([
                _(
                    "The Note block is a container for one or more Pitch blocks."
                ) +
                    " " +
                    _(
                        "The Note block specifies the duration (note value) of its contents."
                    ),
                "documentation",
                null,
                "note1"
            ]);

            this.formBlock({
                name: _("note"),
                args: 1,
                argLabels: [this.lang === "ja" ? _("value2") : _("value")],
                defaults: [1 / 4],
                canCollapse: true
            });
            this.makeMacro((x, y) => [
                [0, "newnote", x, y, [null, 1, 4, 8]],
                [1, "divide", 0, 0, [0, 2, 3]],
                [2, ["number", { value: 1 }], 0, 0, [1]],
                [3, ["number", { value: 4 }], 0, 0, [1]],
                [4, "vspace", 0, 0, [0, 5]],
                [5, "pitch", 0, 0, [4, 6, 7, null]],
                [6, ["solfege", { value: "sol" }], 0, 0, [5]],
                [7, ["number", { value: 4 }], 0, 0, [5]],
                [8, "hidden", 0, 0, [0, null]]
            ]);
        }

        flow(args, logo, turtle, blk, receivedArg) {
            return NoteController._playNote(args, logo, turtle, blk, receivedArg);
        }
    }

    class DefineFrequencyBlock extends FlowClampBlock {
        constructor() {
            super("definefrequency");
            this.setPalette("rhythm");
            this.setHelpString();

            this.formBlock({
                name: _("define frequency"),
                args: 1
            });
            this.hidden = true;
        }
    }

    class OctaveSpaceBlock extends FlowBlock {
        constructor() {
            super("octavespace", _("octave space"));
            this.setPalette("rhythm");
            this.setHelpString();

            this.formBlock({
                args: 1
            });
            this.hidden = true;
        }
    }

    new MyNoteValueBlock().setup();
    new SkipFactorBlock().setup();
    new MillisecondsBlock().setup();
    new SwingBlock().setup();
    new NewSwingBlock().setup();
    new NewSwing2Block().setup();
    new SkipNotesBlock().setup();
    new MultiplyBeatFactorBlock().setup();
    new TieBlock().setup();
    new RhythmicDotBlock().setup();
    new RhythmicDot2Block().setup();
    new Rest2Block().setup();
    new Note4Block().setup();
    new Note3Block().setup();
    new Note5Block().setup();
    new Note8Block().setup();
    new Note7Block().setup();
    new Note6Block().setup();
    new Note2Block().setup();
    new Note1Block().setup();
    new NoteBlock().setup();
    new NewNoteBlock().setup();
    new DefineFrequencyBlock().setup();
    new OctaveSpaceBlock().setup();
}
