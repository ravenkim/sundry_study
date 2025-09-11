import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLabelDto } from './dto/create-label.dto';
import {
  LabelSubmission,
  LabelSubmissionDocument,
} from './schemas/label-submission.schema';

@Injectable()
export class LabelsService {
  constructor(
    @InjectModel(LabelSubmission.name)
    private readonly labelSubmissionModel: Model<LabelSubmissionDocument>,
  ) {}

  async create(createLabelDto: CreateLabelDto): Promise<LabelSubmission> {
    const createdLabelSubmission = new this.labelSubmissionModel({
      ...createLabelDto,
    });
    return createdLabelSubmission.save();
  }
}
