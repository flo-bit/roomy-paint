import {
	defComponent,
	EntityList,
	EntityWrapper,
	LoroMap,
	LoroMovableList,
	NamedEntity,
	type EntityIdStr
} from '@roomy-chat/sdk';

export const DrawnPointComponent = defComponent(
	'name:01JPEBV8TJ8YCXYYD256NJSR5X',
	LoroMap<{ x: number; y: number; color: string }>
);

export class DrawnPoint extends EntityWrapper {
	get x() {
		const entity = this.entity.getOrInit(DrawnPointComponent);
		return entity.get('x');
	}
	set x(value: number) {
		const entity = this.entity.getOrInit(DrawnPointComponent);
		entity.set('x', value);
	}

	get y() {
		const entity = this.entity.getOrInit(DrawnPointComponent);
		return entity.get('y');
	}
	set y(value: number) {
		const entity = this.entity.getOrInit(DrawnPointComponent);
		entity.set('y', value);
	}

	get color() {
		const entity = this.entity.getOrInit(DrawnPointComponent);
		return entity.get('color');
	}
	set color(value: string) {
		const entity = this.entity.getOrInit(DrawnPointComponent);
		entity.set('color', value);
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
