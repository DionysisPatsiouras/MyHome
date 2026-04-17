'use client'

import { useState, useRef } from 'react'

import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'

// import { Toast } from 'primereact/toast'

const confirmDelete = () => {

    // const toast = useRef(null)

    // const accept = () => {
    //     alert("tst")
    //     toast.current.show({ severity: 'info', summary: 'Επιβεβαίωση', detail: 'Η καταχώρηση διαγράφηκε επιτυχώς', life: 3000 });
    // }

    // const reject = () => {
    //     toast.current.show({ severity: 'warn', summary: 'Ακύρωση', detail: 'Η διαγραφή ακυρώθηκε', life: 3000 });
    // }

    return confirmDialog({
        message: 'Θέλετε να διαγράψετε αυτή την καταχώρηση;',
        header: 'Διαγραφή',
        icon: 'pi pi-info-circle',
        defaultFocus: 'reject',
        acceptClassName: 'p-button-danger',
        acceptLabel: 'Διαγραφή',
        rejectLabel: 'Άκυρο',
        // accept,
        // reject
    });
}


export { confirmDelete }
