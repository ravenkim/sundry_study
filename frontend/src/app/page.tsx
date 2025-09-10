import DiffLabeler from "@/components/DiffLabeler";
import { testDiffString } from "@/utils/testData"; // todo 더미데이터 to > 사용자가 api 로 받아오게끔

export default function Home() {
  // 기능 요구사항 1 todo 데이터 가져오는 기능 추가

  return <DiffLabeler diffString={testDiffString} />;
}
