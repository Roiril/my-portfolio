import CubeDiaryPage from '@/features/works/pages/cube-diary/CubeDiaryPage';
import { workMetadata } from '@/features/works/metadata';

export const metadata = workMetadata('cube-diary');

export default function Page() {
    return <CubeDiaryPage />;
}
