import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LabelSubmissionDocument = HydratedDocument<LabelSubmission>;

@Schema()
class LabelSelection {
  @Prop()
  line: number;

  @Prop()
  col: number;
}

const LabelSelectionSchema = SchemaFactory.createForClass(LabelSelection);

@Schema()
class LabelCoordinates {
  @Prop({ type: LabelSelectionSchema })
  start: LabelSelection;

  @Prop({ type: LabelSelectionSchema })
  end: LabelSelection;
}

const LabelCoordinatesSchema = SchemaFactory.createForClass(LabelCoordinates);

@Schema()
class Label {
  @Prop()
  file: string;

  @Prop()
  changeType: 'inserted' | 'deleted';

  @Prop({ type: LabelCoordinatesSchema })
  selection: LabelCoordinates;

  @Prop()
  label: string;
}

const LabelSchema = SchemaFactory.createForClass(Label);

@Schema({ timestamps: { createdAt: 'submissionAt', updatedAt: 'updatedAt' } })
export class LabelSubmission {
  @Prop({ required: true })
  pullRequestUrl: string;

  @Prop({ required: true })
  diffFetchedAt: Date;

  @Prop({ type: [LabelSchema] })
  labels: Label[];
}

export const LabelSubmissionSchema =
  SchemaFactory.createForClass(LabelSubmission);
