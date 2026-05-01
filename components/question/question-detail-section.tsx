import { TagList } from '@/components/common/tag-list';

type QuestionDetailSectionProps = {
  question: string;
  tags: string[];
  idealAnswer: string;
};

export function QuestionDetailSection({
  question,
  tags,
  idealAnswer,
}: QuestionDetailSectionProps) {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center sm:gap-4 gap-3">
        <div className="font-semibold text-4xl">Q.</div>
        <h1 className="text-base">{question}</h1>
      </div>
      <TagList tags={tags} />
      <div>
        <h2>모범 답변</h2>
        <p>{idealAnswer}</p>
      </div>
    </section>
  );
}
