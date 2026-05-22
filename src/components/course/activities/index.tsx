import type { ComponentType } from 'react';
import type { ActivityKind } from '../../../data/course';
import type { ActivityProps } from './types';

import TimeAudit from './TimeAudit';
import TimeBlocking from './TimeBlocking';
import BoundarySetting from './BoundarySetting';
import DistractionMapping from './DistractionMapping';
import EnergyRhythms from './EnergyRhythms';
import Pareto from './Pareto';
import WorkLifeIntegration from './WorkLifeIntegration';
import MasteryRoadmap from './MasteryRoadmap';
import Reflection from './Reflection';

const REGISTRY: Partial<Record<ActivityKind, ComponentType<ActivityProps>>> = {
  'time-audit': TimeAudit,
  'time-blocking': TimeBlocking,
  'boundary-setting': BoundarySetting,
  'distraction-mapping': DistractionMapping,
  'energy-rhythms': EnergyRhythms,
  pareto: Pareto,
  'work-life-integration': WorkLifeIntegration,
  'mastery-roadmap': MasteryRoadmap,
};

/** Resolve an activity kind to its component, falling back to the generic reflection worksheet. */
export function activityComponent(kind: ActivityKind): ComponentType<ActivityProps> {
  return REGISTRY[kind] ?? Reflection;
}
