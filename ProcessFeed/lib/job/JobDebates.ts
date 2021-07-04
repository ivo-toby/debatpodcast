import { DebatDay } from '@shared/lib/debatDirect/debatTypes';
import AbstractJob from './AbstractJob';
import { AbstractJobType } from './types';

export default class JobDebates extends AbstractJob<DebatDay> implements AbstractJobType<DebatDay> {

}
