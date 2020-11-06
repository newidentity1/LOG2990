import { MatDialogRef } from '@angular/material/dialog';

export class MatDialogMock {
    // tslint:disable-next-line:no-any / reason: creating a mock dialog ref
    openDialogs: MatDialogRef<any>[] = [];

    open(): {} {
        return {};
    }

    closeAll(): {} {
        return {};
    }
}
