export class ResToCreate {
  public Name: string;
  public Max: string;
  public ListOfUsers: any;

  constructor(name: string, max: string, listOfUsers: any) {
    this.Name = name;
    this.Max = max;
    this.ListOfUsers = listOfUsers;
  }
}
