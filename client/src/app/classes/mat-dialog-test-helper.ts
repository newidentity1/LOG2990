import { MatDialogRef } from '@angular/material/dialog';

export class MatDialogMock {
    // tslint:disable-next-line:no-any / reason: creating a mock dialog ref
    openDialogs: MatDialogRef<any>[] = [];
    // When the component calls this.dialog.open(...) we'll return an empty object
    open(): {} {
        return {};
    }

    closeAll(): {} {
        return {};
    }
}
