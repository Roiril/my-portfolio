import AquariumPage from '@/features/works/pages/aquarium/AquariumPage';
import { workMetadata } from '@/features/works/metadata';

export const metadata = workMetadata('aquarium');

export default function Page() {
    return <AquariumPage />;
}
