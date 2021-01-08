export class IPAddress {
  public count: number = 0;
  public timestamp: number = Date.now();
  constructor(
    public ip: string,
  ) { }
}