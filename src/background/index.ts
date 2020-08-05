import { Extension } from '@/background/extension';
import { migrate } from '@/background/util/migrate';

migrate().then(() => {
	new Extension().start();
});
