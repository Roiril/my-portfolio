import BlenderWorksPage from '@/features/works/pages/blender-works/BlenderWorksPage';
import { workMetadata } from '@/features/works/metadata';

export const metadata = workMetadata('blender-works');

export default function Page() {
    return <BlenderWorksPage />;
}
