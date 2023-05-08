import { Setter } from 'solid-js';
import EditedTracks from './edited-tracks';
import RegexEdits from './regex-edits';
import { t } from '@/util/i18n';
import { ModalType } from '../navigator';

export default function EditOptions(props: {
	setActiveModal: Setter<ModalType>;
	modal: HTMLDialogElement | undefined;
}) {
	return (
		<>
			<h1>{t('optionsEdits')}</h1>
			<EditedTracks
				setActiveModal={props.setActiveModal}
				modal={props.modal}
			/>
			<RegexEdits
				setActiveModal={props.setActiveModal}
				modal={props.modal}
			/>
		</>
	);
}
