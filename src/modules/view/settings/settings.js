import { LightningElement } from 'lwc';

export default class Settings extends LightningElement {
    commitHash = process.env.COMMIT_HASH;
    releaseDate = process.env.RELEASE_DATE;
}
