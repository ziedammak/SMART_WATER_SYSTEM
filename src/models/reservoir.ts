export class Reservoir{
  public Id: any;
  public Name: string;
  public Max: number;
  public Level: number;
  public PompeState: boolean;
  public ListOfUsers: any[];

  constructor(id: any, name: string, max: number, level: number, pompeState: boolean, listOfUsers: any[]) {
    this.Id = id;
    this.Name = name;
    this.Max = max;
    this.Level = level;
    this.PompeState = pompeState;
    this.ListOfUsers = listOfUsers;
  }
}
