<template>
	<div class="modal fade" ref="bsModal" role="dialog">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">
						<slot name="header"></slot>
					</h5>
					<button
						type="button"
						class="close"
						aria-label="Close"
						data-dismiss="modal"
					>
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<slot name="body"></slot>
				</div>
				<div class="modal-footer">
					<button
						type="button"
						class="btn btn-secondary"
						data-dismiss="modal"
					>
						{{ L('buttonCancel') }}
					</button>
					<button
						type="button"
						class="btn btn-primary"
						@click="emitOnOkClickEvent"
					>
						{{ L('buttonOk') }}
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
// FIXME Remove dependency
import Modal from 'bootstrap/js/dist/modal.js';

export default {
	mounted() {
		const { bsModal } = this.$refs;
		bsModal.addEventListener('hide.bs.modal', () => {
			this.emitOnCloseEvent();
		});

		this.modal = new Modal(bsModal);
		this.modal.show();
	},
	methods: {
		emitOnCloseEvent() {
			this.$emit('onClose');
		},

		emitOnOkClickEvent() {
			this.modal.hide();
			this.$emit('onOkClick');
		},
	},
};
</script>
