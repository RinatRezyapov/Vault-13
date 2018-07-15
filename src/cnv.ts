import { State } from "./main";
import { mergeToState } from "./stateHandlers";
import { config } from "./config";

declare var OffscreenCanvas: any;

export const getCanvas = (state: State) => {
        const canvasParametres = state.canvasParametres;

        const canvasHex = document.getElementById("canvasHex") as HTMLCanvasElement;
        const canvasInteraction = document.getElementById("canvasInteraction") as HTMLCanvasElement;

        const canvasHexOffscreen = new OffscreenCanvas(canvasParametres.offscreenWidth, canvasParametres.offscreenHeight);
        const canvasInteractionOffscreen = new OffscreenCanvas(canvasParametres.offscreenWidth, canvasParametres.offscreenHeight);

        if (canvasHex && canvasInteraction) {
            setCanvasSize(canvasHex, state);
            setCanvasSize(canvasInteraction, state);
        }

        const rect = canvasInteraction.getBoundingClientRect();

        return mergeToState(state, {
            canvasParametres: {
                width: config.canvasWidth,
                height: config.canvasHeight,
                offscreenWidth: config.offscreenCanvasWidth,
                offscreenHeight: config.offscreenCanvasHeight,
                left: rect.left,
                right: rect.right,
                top: rect.top,
                bottom: rect.bottom
            },
            canvases: {
                canvasHex: canvasHex,
                canvasInteraction: canvasInteraction,
                canvasHexOffscreen: canvasHexOffscreen,
                canvasInteractionOffscreen: canvasInteractionOffscreen,
            }
        });
    }

const setCanvasSize = (canvas: HTMLCanvasElement, state: State) => {
        const canvasParametres = state.canvasParametres;
        canvas.width = canvasParametres.width;
        canvas.height = canvasParametres.height;
}
