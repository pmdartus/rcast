import { LightningElement, track } from 'lwc';

export default class App extends LightningElement {
    @track viewName = 'podcast';

    handleNavigate(event) {
        const { viewName } = event.detail;
        this.viewName = viewName;
    } 
}