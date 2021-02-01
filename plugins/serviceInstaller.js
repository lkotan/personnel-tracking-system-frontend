import RepositoryService from "../Repositories/RepositoryService";
import PersonnelService from "../services/PersonnelService";
import AssigmentTagService from "../services/AssigmentTagService";
import TitleService from "../services/TitleService";
import DepartmentService from "../services/DepartmentService";
import RoleService from "../services/RoleService";
import EmailTemplateService from "../services/EmailTemplateService";
import EmailParameterService from "../services/EmailParameterService";
import RuleService from "../services/RuleService";
import AssigmentService from "../services/AssigmentService";
import NotificationService from "../services/NotificationService";
import PersonnelNotificationService from "../services/PersonnelNotificationService";
import AuthService from "../services/AuthService";

import HubService from "../services/HubService";


export default (context, inject) => {
  inject('RepositoryService', new RepositoryService(context))

  inject('PersonnelService', new PersonnelService(context))
  inject('AssigmentTagService', new AssigmentTagService(context))
  inject('TitleService', new TitleService(context))
  inject('DepartmentService', new DepartmentService(context))
  inject('RoleService', new RoleService(context))
  inject('EmailTemplateService', new EmailTemplateService(context))
  inject('EmailParameterService', new EmailParameterService(context))
  inject('RuleService', new RuleService(context))
  inject("AssigmentService", new AssigmentService(context))
  inject("NotificationService", new NotificationService(context))
  inject("PersonnelNotificationService", new PersonnelNotificationService(context))
   inject("AuthService", new AuthService(context))

  inject("HubService", new HubService(context))
}
