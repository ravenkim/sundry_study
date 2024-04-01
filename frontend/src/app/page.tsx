import DiffLabeler from "@/components/DiffLabeler";
import { testDiffString } from "@/utils/testData";

export default function Home() {
  return <DiffLabeler diffString={testDiffString} />;
}
