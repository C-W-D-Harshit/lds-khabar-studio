import React from 'react';
import {Composition} from 'remotion';
import {Main} from './Main';
import {FPS} from './theme';
import {TOTAL_SEC} from './lib/timeline';
import {Short} from './shorts/Short';
import {SHORTS, shortDur} from './shorts/config';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="NewsBulletin" component={Main} durationInFrames={Math.ceil(TOTAL_SEC * FPS)} fps={FPS} width={1920} height={1080} />
    {SHORTS.map((c) => (
      <Composition key={c.slug} id={`Short-${c.id}`} component={Short as any} defaultProps={{c}} durationInFrames={Math.ceil(shortDur(c) * FPS)} fps={FPS} width={1080} height={1920} />
    ))}
  </>
);
