import Paragraph from './blocks/Paragraph';
import List from './blocks/List';
import DataTable from './blocks/DataTable';
import CalloutBox from './blocks/CalloutBox';
import HeadingAnchor from './HeadingAnchor';

/** Renders a chapter's blocks in order. Knows nothing about where they came from. */
export default function ChapterView({ chapter }) {
  return (
    <div className="print-full">
      {chapter.blocks.map((block, i) => {
        switch (block.type) {
          case 'heading':
            return <HeadingAnchor key={i} block={block} />;
          case 'paragraph':
            return <Paragraph key={i} block={block} />;
          case 'list':
            return <List key={i} block={block} />;
          case 'table':
            return <DataTable key={i} block={block} />;
          case 'callout':
            return <CalloutBox key={i} block={block} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
