import { LightningElement, api, track } from 'lwc';
import { formatTime } from 'base/utils';

const THUMB_SIZE = 16;

export default class RcastProgressBar extends LightningElement {
    // Track duration
    @api duration = 0;

    // Internal track currentTime value.
    // TODO: add details about the controlled vs. uncontrolled state
    @track _currentTime = 0;

    // Flag indicating if the progress bar is currently dragged/hold by the user. In this case the currentTime public
    // property change should not be reflected.
    isControlled = false;

    // Hold the slider bounding rect information to position the different items.
    progressBarBoundingRect = null;
    progressValueEl = null;
    progressThumbEl = null;

    @api
    set currentTime(value) {
        if (!this.isControlled) {
            this._currentTime = value;
        }
    }

    handleWindowResize = () => {
        this.updateSliderBoundingRect();
        this.updatePositions();
    };

    connectedCallback() {
        window.addEventListener('resize', this.handleWindowResize);
    }

    disconnectedCallback() {
        window.removeEventListener('resize', this.handleWindowResize);
    }

    renderedCallback() {
        if (!this.progressValueEl || !this.progressThumbEl) {
            this.progressValueEl = this.template.querySelector(
                '.progress-bar-value',
            );
            this.progressThumbEl = this.template.querySelector(
                '.progress-bar-thumb',
            );
        }

        if (!this.progressBarBoundingRect) {
            this.updateSliderBoundingRect();
        }

        this.updatePositions();
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

    updateSliderBoundingRect() {
        this.progressBarBoundingRect = this.template
            .querySelector('.progress-bar')
            .getBoundingClientRect();
    }

    updatePositions() {
        const { duration, currentTime, progressBarBoundingRect } = this;
        const value = duration === 0 ? 0 : currentTime / duration;

        this.progressValueEl.style.transform = `scaleX(${value})`;
        this.progressThumbEl.style.transform = `translateX(${value *
            progressBarBoundingRect.width -
            THUMB_SIZE / 2}px) translateY(${THUMB_SIZE / 2}px)`;
    }

    handleProgressTouchStart() {
        const startX = this.progressBarBoundingRect.x;
        const endX = startX + this.progressBarBoundingRect.width;

        this.isControlled = true;

        const touchMove = evt => {
            const touch = evt.touches[0];
            const currentX = touch.pageX;

            const sliderX = Math.min(Math.max(currentX, startX), endX);
            const value =
                ((startX - sliderX) / (startX - endX)) * this.duration;

            this._currentTime = value;
        };

        const touchEnd = () => {
            this.isControlled = false;

            window.removeEventListener('touchmove', touchMove);
            window.removeEventListener('touchend', touchEnd);

            this.dispatchEvent(
                new CustomEvent('currenttimechange', {
                    detail: {
                        value: this._currentTime,
                    },
                }),
            );
        };

        window.addEventListener('touchmove', touchMove);
        window.addEventListener('touchend', touchEnd);
    }
}
