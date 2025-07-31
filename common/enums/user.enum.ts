export enum UserRoleEnum {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}

export enum UserPermissionEnum {
  USER_CREATE = 'user.create',
  USER_READ = 'user.read',
  USER_UPDATE = 'user.update',
  USER_DELETE = 'user.delete',
  BOT_CREATE = 'bot.create',
  BOT_READ = 'bot.read',
  BOT_UPDATE = 'bot.update',
  BOT_DELETE = 'bot.delete',
  CORPORATE_CREATE = 'corporate.create',
  CORPORATE_READ = 'corporate.read',
  CORPORATE_UPDATE = 'corporate.update',
  CORPORATE_DELETE = 'corporate.delete',
  DASHBOARD_VIEW = 'dashboard.view',
}
