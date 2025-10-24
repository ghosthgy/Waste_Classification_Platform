import INDEX from '../pages/index.jsx';
import COLLECTION_POINTS from '../pages/collection-points.jsx';
import COLLECTION_MANAGEMENT from '../pages/collection-management.jsx';
import RESIDENT_SERVICE from '../pages/resident-service.jsx';
import REPORTS from '../pages/reports.jsx';
export const routers = [{
  id: "index",
  component: INDEX
}, {
  id: "collection-points",
  component: COLLECTION_POINTS
}, {
  id: "collection-management",
  component: COLLECTION_MANAGEMENT
}, {
  id: "resident-service",
  component: RESIDENT_SERVICE
}, {
  id: "reports",
  component: REPORTS
}]