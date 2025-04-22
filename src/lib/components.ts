import {
	defComponent,
	EntityList,
	EntityWrapper,
	LoroMap,
	LoroMovableList,
	NamedEntity,
	type EntityIdStr
} from './roomy';

export const DrawnPointComponent = defComponent(
	'name:01JPEBV8TJ8YCXYYD256NJSR5X',
	LoroMap<{ x: number; y: number; r: number; g: number; b: number }>
);

export class DrawnPoint extends EntityWrapper {
	get x() {
		return this.entity.getOrInit(DrawnPointComponent, (entity) => entity.get('x'));
	}
	set x(value: number) {
		this.entity.getOrInit(DrawnPointComponent, (entity) => entity.set('x', value));
	}

	get y() {
		return this.entity.getOrInit(DrawnPointComponent, (entity) => entity.get('y'));
	}
	set y(value: number) {
		this.entity.getOrInit(DrawnPointComponent, (entity) => entity.set('y', value));
	}

	get r() {
		return this.entity.getOrInit(DrawnPointComponent, (entity) => entity.get('r'));
	}
	set r(value: number) {
		this.entity.getOrInit(DrawnPointComponent, (entity) => entity.set('r', value));
	}

	get g() {
		return this.entity.getOrInit(DrawnPointComponent, (entity) => entity.get('g'));
	}
	set g(value: number) {
		this.entity.getOrInit(DrawnPointComponent, (entity) => entity.set('g', value));
	}

	get b() {
		return this.entity.getOrInit(DrawnPointComponent, (entity) => entity.get('b'));
	}
	set b(value: number) {
		this.entity.getOrInit(DrawnPointComponent, (entity) => entity.set('b', value));
	}
}

export const Paint = defComponent(
	'paints:02JPFMTA2QAFY2D3CV1C0YBZQ1',
	LoroMovableList<EntityIdStr>
);

export class Painting extends NamedEntity {
	get points(): EntityList<DrawnPoint> {
		return new EntityList(this.peer, this.entity, Paint, DrawnPoint);
	}
}
