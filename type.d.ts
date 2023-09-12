export type MapProps = {
    data: d3.DSVRowArray<string> | undefined,
    topology: any,
    filter: {
        type: string,
        year: string
    }
}

export type ChartDialogProp = {
    openDialog: boolean,
    setOpenDialog: any
}

export type UsStates = {
    [key: string]: string
}