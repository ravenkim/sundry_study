import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LabelSubmissionDocument = HydratedDocument<LabelSubmission>;

@Schema({ _id: false })
class Position {
  @Prop()
  row: number;

  @Prop()
  column: number;
}

const PositionSchema = SchemaFactory.createForClass(Position);

@Schema({ _id: false })
class Label {
  @Prop()
  id: number;

  @Prop()
  fileName: string;

  @Prop()
  changeType: 'Inserted' | 'Deleted';

  @Prop({ type: [PositionSchema] })
  selectedRange: Position[];
}

const LabelSchema = SchemaFactory.createForClass(Label);

@Schema({ timestamps: { createdAt: 'submissionAt', updatedAt: 'updatedAt' } })
export class LabelSubmission {
  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  time: number;

  @Prop({ type: [LabelSchema] })
  labels: Label[];
}

export const LabelSubmissionSchema =
  SchemaFactory.createForClass(LabelSubmission);
