export type Props = {
  diffString: string;
};

export type Position = {
  row: number;
  column: number;
};

export type SelectedRange = [Position, Position];

export type InclusionType =
  | 'Included'
  | 'Include'
  | 'PartlyIncluded'
  | 'NotIncluded'
  | 'StartIncluded'
  | 'EndIncluded';

export type ChangeType = 'Inserted' | 'Deleted';
export interface Label {
  id: number;
  fileName: string;
  changeType: ChangeType;
  selectedRange: SelectedRange;
}
