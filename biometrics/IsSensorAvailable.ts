interface IsSensorAvailableResult {
    available: boolean;
    biometryType?: 'TouchID' | 'FaceID' | 'Biometrics';
    error?: string;
}