export enum ThingStatus {
    READY,  // this thing is working!
    BORROWED,
    DAMAGED, // this thing needs repairs to work again, can't loan now
    RESERVED //item is held for someone
}