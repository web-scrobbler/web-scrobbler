import { StorageDumper } from '@/background/storage2/dumper/StorageDumper';
import { StorageDumperImpl } from '@/background/storage2/dumper/StorageDumperImpl';

export function getStorageDumper(): StorageDumper {
	return storageDumper;
}

const storageDumper = new StorageDumperImpl();
