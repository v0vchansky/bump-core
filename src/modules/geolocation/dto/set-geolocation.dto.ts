export interface IGeolocation {
    lat: number;
    lon: number;
    speed: number;
    localTime: Date;
    batteryLevel: number;
    batteryIsCharging: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export class SetGeolocationDto {
    points: IGeolocation[];
}
