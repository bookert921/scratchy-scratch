export class AppActivity {
  public id?;

  public name: string;
  public url?: string;
  public icon?;
  public badge?;
  public link?: string;
  public shared: boolean = false;

  public login?: Login;
  public logout?: Logout;
  public status?: string;
  public timeDifference;

  public lastUpdated;
  public timeStamp;
  public lastUpdatedBy?;
  public views?: number;
  public lastViewed?;

  public draft?: boolean = true;
  public deleted?: boolean = false;
  public keywords?;

  public user_id;
  public userName;
  public userImage?;

  public bookmarked?;
  public bookmarkedCount?;
  public favored?;
  public favoredCount?;
  public broadcasted?;
  public broadcastedCount?;

  static restoreData(data: any): void {
    data.id = data.hasOwnProperty('id') ? data.id : null;
    data.name = data.hasOwnProperty('name') ? data.name : null;
    data.url = data.hasOwnProperty('url') ? data.url : null;
    data.icon = data.hasOwnProperty('icon') ? data.icon : null;
    data.badge = data.hasOwnProperty('badge') ? data.badge : null;
    data.link = data.hasOwnProperty('link') ? data.link : null;
    data.shared = data.hasOwnProperty('shared') ? data.shared : false;

    data.login = data.hasOwnProperty('login') ? data.login : null;
    data.logout = data.hasOwnProperty('logout') ? data.logout : null;
    data.status = data.hasOwnProperty('status') ? data.status : null;
    data.timeDifference = data.hasOwnProperty('timeDifference') ? data.timeDifference : null;

    data.lastUpdated = data.hasOwnProperty('lastUpdated') ? data.lastUpdated : null;
    data.timeStamp = data.hasOwnProperty('timeStamp') ? data.timeStamp : null;
    data.lastUpdatedBy = data.hasOwnProperty('lastUpdatedBy') ? data.lastUpdatedBy : null;
    data.views = data.hasOwnProperty('views') ? data.views : 0;
    data.lastViewed = data.hasOwnProperty('lastViewed') ? data.lastViewed : null;

    data.draft = data.hasOwnProperty('draft') ? data.draft : true;
    data.deleted = data.hasOwnProperty('deleted') ? data.deleted : false;
    data.keywords = data.hasOwnProperty('keywords') ? data.keywords : null;

    data.user_id = data.hasOwnProperty('user_id') ? data.user_id : null;
    data.userName = data.hasOwnProperty('userName') ? data.userName : null;
    data.userImage = data.hasOwnProperty('userImage') ? data.userImage : null;

    data.bookmarked = data.hasOwnProperty('bookmarked') ? data.bookmarked : false;
    data.bookmarkedCount = data.hasOwnProperty('bookmarkedCount') ? data.bookmarkedCount : 0;
    data.favored = data.hasOwnProperty('favored') ? data.favored : false;
    data.favoredCount = data.hasOwnProperty('favoredCount') ? data.favoredCount : 0;
    data.broadcasted = data.hasOwnProperty('broadcasted') ? data.broadcasted : false;
    data.broadcastedCount = data.hasOwnProperty('broadcastedCount') ? data.broadcastedCount : 0;
  }

}

export interface Login {
  name: string;
  start;
}
export interface Logout {
  name: string;
  end;
}