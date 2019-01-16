export class User {
  public Id: any;
  public Mail: string;
  public IsChecked: boolean;

  constructor(id: any, mail: string, isChecked: boolean) {
    this.Id = id;
    this.Mail = mail;
    this.IsChecked = isChecked;
  }
}
