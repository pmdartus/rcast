import { LightningElement, api, track } from 'lwc';
import { formatTime } from 'rcast/utils';

export default class RcastProgressBar extends LightningElement {
    // Track duration
    @api duration = 0;

    // Internal track currentTime value.
    // TODO: add details about the controlled vs. uncontrolled state
    @track _currentTime = 0;

    // Flag indicating if the progress bar is currently dragged/hold by the user. In this case the currentTime public 
    // property change should not be reflected.
    isControlled = false;

    @api
    set currentTime(value) {
        if (!this.isControlled) {
            this._currentTime = value;
        }
    }
    get currentTime() {
        return this._currentTime;
    }

    get pastLabel() {
        return formatTime(this.currentTime);
    }
    get remainingLabel() {
        return `-${formatTime(this.duration - this.currentTime)}`;
    }
    get progressBarValue() {
        return this.currentTime / this.duration;
    }

    handleProgressMouseDown() {
        this.isControlled = true;
    }
    handleProgressMouseUp() {
        this.isControlled = false;
    }
    handleProgressInput(event) {
        const { value } = event.target;
        this._currentTime = this.duration * value;
    }

    handleProgressChange(event) {
        const { value } = event.target;

        this.dispatchEvent(
            new CustomEvent('currenttimechange', {
                detail: {
                    currentTime: value,
                },
            }),
        );
    }
}
