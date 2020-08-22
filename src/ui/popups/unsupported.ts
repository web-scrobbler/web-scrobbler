import 'bootstrap/dist/css/bootstrap.css';
import '@/ui/base.css';

import { createVueApp } from '@/ui/vue-helper';

import Unsupported from '@/ui/popups/unsupported.vue';

createVueApp(Unsupported);
