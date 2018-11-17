import update from 'immutability-helper';
import { isNone, Option, fromNullable, none } from 'fp-ts/lib/Option';

import { getHexCornerCoord } from './hex';
import { getDistance } from './geometry';
import { hexToPixel, hexToString } from './converters';
import { State, updateState } from './main';
import { config } from './config';
import Segment from './domain/Segment';
import { PointWithAngle, MapObject, Point, Hex } from './domain/entities';
import { frameOffsets, frameOffsets1, gameSprites } from './utils/constants';
import { getTime } from './clocks';
import { getFrameOffset } from './player';

declare const OffscreenCanvas: any;
export let canvasHex: Option<HTMLCanvasElement> = none;
export let canvasInteraction: Option<HTMLCanvasElement> = none;
export let canvasHexOffscreen: Option<HTMLCanvasElement> = none;
export let canvasInteractionOffscreen: Option<HTMLCanvasElement> = none;

type ImagesObject = { [name: string]: HTMLImageElement };

let images: ImagesObject = {};
let imageMap: { [name: string]: any } = {};

export const loadAssets = (callback: () => void) => {
  loadJSON('json/imageMap', (result: any) => {
    loadImages(gameSprites, (result: any) => {
      callback();
    })
  });
}

export const loadImages = (imagesArr: Array<string>, callback: (images: ImagesObject) => void) => {
  let name: string;
  let count = imagesArr.length;
  const onload = () => {
    if (--count == 0) callback(images);
  }
  for (let i = 0; i < imagesArr.length; i++) {
    name = imagesArr[i];
    images[name] = document.createElement('img');
    images[name].addEventListener('load', onload);
    images[name].src = "img/" + name + ".png";
  }
}

export const loadJSON = (url: string, onsuccess: any) => {
  let request = new XMLHttpRequest();
  request.onreadystatechange = function () {
    if ((request.readyState == 4) && (request.status == 200)) {
      imageMap = JSON.parse(request.responseText);
      onsuccess(imageMap);
    }
  }
  request.open("GET", url + ".json", true);
  request.send();
}

export const getImageMap = (imageName: string) => {
  return imageMap[`art/critters/${imageName}`]
}

export const initCanvas = (state: State): State => {
  if (isNone(state.userId)) return state;
  const canvasContainer = fromNullable(document.getElementById('canvasContainer'));
  canvasHex = fromNullable(document.createElement('canvas'));
  canvasInteraction = fromNullable(document.createElement('canvas'));
  canvasHex.map(canvasHex => {
    canvasHex.id = 'canvasHex';
    setCanvasSize(canvasHex);
    canvasContainer.map(canvasContainer => {
      canvasContainer.appendChild(canvasHex);

    });
  });
  canvasInteraction.map(canvasInteraction => {
    canvasInteraction.id = 'canvasInteraction';
    setCanvasSize(canvasInteraction);
    canvasContainer.map(canvasContainer => {
      canvasContainer.appendChild(canvasInteraction);
    });
  });

  const rect = canvasInteraction.map(canvasInteraction => canvasInteraction.getBoundingClientRect()).getOrElse(new DOMRect(0, 0, 0, 0));

  canvasHexOffscreen = fromNullable(new OffscreenCanvas(config.offscreenCanvasWidth, config.offscreenCanvasHeight));
  canvasInteractionOffscreen = fromNullable(new OffscreenCanvas(config.offscreenCanvasWidth, config.offscreenCanvasHeight));
  return update(state, {
    canvasParametres: {
      $merge: {
        left: rect.left,
        right: rect.right,
        top: rect.top,
        bottom: rect.bottom
      }
    },
    canvases: {
      $merge: {
        canvasHex: canvasHex,
        canvasInteraction: canvasInteraction,
        canvasHexOffscreen: canvasHexOffscreen,
        canvasInteractionOffscreen: canvasInteractionOffscreen,
      }
    }
  });
}

const setCanvasSize = (canvas: HTMLCanvasElement): void => {
  canvas.width = config.canvasWidth;
  canvas.height = config.canvasHeight
}

export const drawImage = (
  canvasId: string,
  image: HTMLImageElement,
  sx: number, sy: number,
  sw: number, sh: number,
  dx: number, dy: number,
  dw: number, dh: number,
): void => {
  const canvas = canvasId === 'canvasInteractionOffscreen' ? canvasInteractionOffscreen : canvasHexOffscreen;
  canvas.map(canvas => {
    const ctx = fromNullable(canvas.getContext('2d'));
    ctx.map(ctx => ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh));
  })
}

export const drawDynamicObjects = (obstacleSides: Segment, closestIntersect: PointWithAngle, player: MapObject, drawnedObjects: any): void => {
  if (obstacleSides.object.type !== 'player') return;
  if (obstacleSides.object.id === player.id) return;
  if (drawnedObjects.hasOwnProperty(obstacleSides.object.id)) return;
  const distance = getDistance(hexToPixel(player.position), new Point(closestIntersect.x, closestIntersect.y));
  const object = obstacleSides.object;
  if (distance < 200) {
    const art = object.path.length > 0 ? 'nmvaltat' : 'nmvaltaa';
    const imageMap = getImageMap(art)
    drawImage(
      'canvasInteractionOffscreen',
      images[art],
      imageMap.frameOffsets[object.frameOffset][object.frame].sx,
      0,
      imageMap.frameWidth,
      imageMap.frameHeight,
      hexToPixel(object.position).x - 10,
      hexToPixel(object.position).y - 60,
      imageMap.frameWidth,
      imageMap.frameHeight,
    );
    drawDynamicObjectsNames('canvasInteractionOffscreen', object);
    drawnedObjects[object.id] = true
  }
}

export const drawStaticObjects = (object: MapObject): void => {
  if (object.type === 'wall') {
    drawHex('canvasInteractionOffscreen', hexToPixel(object.position), 1, 'transparent', 'rgba(255, 0, 0, 0.1)');
  }
}

export const drawPlayer = (state: State, object: MapObject, i: number): void => {
  const art = object.path.length > 0 ? 'nmvaltat' : 'nmvaltaa';
  const imageMap = getImageMap(art);

  if (getTime() - object.lastFrameTime > 1000 / imageMap.fps) {
    updateState(state, update(state, {
      $merge: {
        mapObjects: update(state.mapObjects, {
          $splice: [[i, 1, update(object, {
            $merge: {
              lastFrameTime: getTime(),
              frame: object.frame >= imageMap.numFrames - 1 ? 0 : object.frame + 1,
              frameOffset: getFrameOffset(object.direction),
            }
          })]]
        })
      }
    }))
  }

  fromNullable(imageMap.frameOffsets[object.frameOffset][object.frame]).map(framesOffset => {
    drawImage(
      'canvasInteractionOffscreen',
      images[art],
      framesOffset.sx,
      0,
      imageMap.frameWidth,
      imageMap.frameHeight,
      hexToPixel(object.position).x - 10,
      hexToPixel(object.position).y - 60,
      imageMap.frameWidth,
      imageMap.frameHeight,
    );
  })

  drawDynamicObjectsNames("canvasInteractionOffscreen", object);
}

export const drawTile = (hexCenter: Point) => {
  drawImage('canvasHexOffscreen', images['edg1000'], 0, 0, 80, 36, hexCenter.x, hexCenter.y - 12, 80, 36)
}

export const drawDynamicObjectsNames = (canvasId: string, object: MapObject): void => {
  const canvas = canvasId === 'canvasInteractionOffscreen' ? canvasInteractionOffscreen : canvasHexOffscreen;
  canvas.map(canvas => {
    const ctx = fromNullable(canvas.getContext('2d'));
    ctx.map(ctx => {
      const currentHexPoint = hexToPixel(object.position);
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      ctx.strokeText(object.nickname, currentHexPoint.x - 25, currentHexPoint.y - 70);
      ctx.fillStyle = 'white';
      ctx.fillText(object.nickname, currentHexPoint.x - 25, currentHexPoint.y - 70);
    });
  });
}

export const drawHex = (canvasId: string, center: Point, lineWidth: number, lineColor: string, fillColor: string): void => {
  for (let i = 0; i <= 5; i++) {
    const start = getHexCornerCoord(center, i);
    const end = getHexCornerCoord(center, i + 1);
    fillHex(canvasId, center, fillColor);
    drawLine(canvasId, start, end, lineWidth, lineColor);
  }
}

const fillHex = (canvasId: string, center: Point, fillColor: string): void => {
  const canvas = canvasId === 'canvasInteractionOffscreen' ? canvasInteractionOffscreen : canvasHexOffscreen;
  canvas.map(canvas => {
    const ctx = fromNullable(canvas.getContext('2d'));
    ctx.map(ctx => {
      const c0 = getHexCornerCoord(center, 0);
      const c1 = getHexCornerCoord(center, 1);
      const c2 = getHexCornerCoord(center, 2);
      const c3 = getHexCornerCoord(center, 3);
      const c4 = getHexCornerCoord(center, 4);
      const c5 = getHexCornerCoord(center, 5);
      ctx.beginPath();
      ctx.fillStyle = fillColor;
      ctx.moveTo(c0.x, c0.y);
      ctx.lineTo(c1.x, c1.y);
      ctx.lineTo(c2.x, c2.y);
      ctx.lineTo(c3.x, c3.y);
      ctx.lineTo(c4.x, c4.y);
      ctx.lineTo(c5.x, c5.y);
      ctx.closePath();
      ctx.fill();
    });
  });
}

export const drawLine = (canvasId: string, start: Point, end: Point, lineWidth: number, lineColor: string): void => {
  const canvas = canvasId === 'canvasInteractionOffscreen' ? canvasInteractionOffscreen : canvasHexOffscreen;
  canvas.map(canvas => {
    const ctx = fromNullable(canvas.getContext('2d'));
    ctx.map(ctx => {
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = lineWidth;
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
      ctx.closePath();
    });
  });
}

export const drawPoint = (canvasId: string, start: Point): void => {
  const canvas = canvasId === 'canvasInteractionOffscreen' ? canvasInteractionOffscreen : canvasHexOffscreen;
  canvas.map(canvas => {
    const ctx = fromNullable(canvas.getContext('2d'));
    ctx.map(ctx => {
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.strokeStyle = 'green';
      ctx.lineWidth = 1;
      ctx.lineTo(start.x + 1, start.y + 1);
      ctx.stroke();
      ctx.closePath();
    });
  });
}

export const animateCurrentHex = (h: Hex): void => {
  drawHex('canvasInteractionOffscreen', hexToPixel(h), 3, '#FF3D00', 'transparent');
  animateCurrentHexCoords(h);
}

export const animateCurrentHexCoords = (h: Hex): void => {
  canvasInteractionOffscreen.map(canvas => {
    const ctx = fromNullable(canvas.getContext('2d'));
    ctx.map(ctx => {
      const currentHexPoint = hexToPixel(h);
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      ctx.strokeText(hexToString(h), currentHexPoint.x + 20, currentHexPoint.y);
      ctx.fillStyle = 'white';
      ctx.fillText(hexToString(h), currentHexPoint.x + 20, currentHexPoint.y);
    });
  });
}

export const drawCanvas = (state: State): void => {
  canvasHex.map(canvas => {
    fromNullable(canvas.getContext('2d')).map(ctx => {
      ctx.clearRect(0, 0, config.canvasWidth, config.canvasHeight);
      canvasHexOffscreen.map(canvasHexOffscreen => {
        ctx.drawImage(canvasHexOffscreen, state.canvasX, state.canvasY, config.canvasWidth, config.canvasHeight, 0, 0, config.canvasWidth, config.canvasHeight);
      })
    });
  });

  canvasInteraction.map(canvas => {
    fromNullable(canvas.getContext('2d')).map(ctx => {
      ctx.clearRect(0, 0, config.canvasWidth, config.canvasHeight);
      canvasInteractionOffscreen.map(canvasInteractionOffscreen => {
        ctx.drawImage(canvasInteractionOffscreen, state.canvasX, state.canvasY, config.canvasWidth, config.canvasHeight, 0, 0, config.canvasWidth, config.canvasHeight);
      })
    });
  });

  canvasInteractionOffscreen.map(canvas => {
    fromNullable(canvas.getContext('2d')).map(ctx => {
      ctx.clearRect(0, 0, config.offscreenCanvasWidth, config.offscreenCanvasHeight);
    });
  });
}

export const drawFOVPoligon = (endPoints: Array<PointWithAngle>): void => {
  canvasInteractionOffscreen.map(canvas => {
    const ctx = fromNullable(canvas.getContext('2d'));
    ctx.map(ctx => {
      endPoints = endPoints.sort((pointA, pointB) => pointA.a - pointB.a);
      ctx.fillStyle = 'rgb(255, 255, 0, 0.1)';
      ctx.beginPath();
      ctx.moveTo(endPoints[0].x, endPoints[0].y);
      for (let i = 1; i < endPoints.length; i++) {
        const intersect = endPoints[i];
        ctx.lineTo(intersect.x, intersect.y);
      }
      ctx.fill();
    });
  });
}

export const drawFOVRays = (endPoints: Array<PointWithAngle>, player: MapObject): void => {
  canvasInteractionOffscreen.map(canvas => {
    const ctx = fromNullable(canvas.getContext('2d'));
    ctx.map(ctx => {
      const playerPosition = hexToPixel(player.position)
      ctx.strokeStyle = 'rgb(255, 255, 0)';
      ctx.fillStyle = 'rgb(173, 255, 47)';
      ctx.lineWidth = 0.1;
      for (let i = 0; i < endPoints.length; i++) {
        const intersect = endPoints[i];
        ctx.beginPath();
        ctx.moveTo(playerPosition.x, playerPosition.y);
        ctx.lineTo(intersect.x, intersect.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(intersect.x, intersect.y, 1, 0, 2 * Math.PI, false);
        ctx.fill();
      }
    });
  });
}

export const drawFOV = (endPoints: Array<PointWithAngle>, player: MapObject): void => {
  if (endPoints.length === 0) return;
  drawFOVPoligon(endPoints);
  drawFOVRays(endPoints, player);
}