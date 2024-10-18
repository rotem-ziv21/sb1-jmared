import { AuthService } from './AuthService';

export interface Tenant {
  id: string;
  name: string;
  ownerId: string;
  locationId?: string;
  calendarId?: string;
  apiToken?: string;
}

const TENANTS_STORAGE_KEY = 'tenants';

export const DataService = {
  async getAllTenants(): Promise<Tenant[]> {
    const storedTenants = localStorage.getItem(TENANTS_STORAGE_KEY);
    return storedTenants ? JSON.parse(storedTenants) : [];
  },

  async getTenantById(tenantId: string): Promise<Tenant | null> {
    const tenants = await this.getAllTenants();
    return tenants.find(tenant => tenant.id === tenantId) || null;
  },

  async createTenant(tenantData: Omit<Tenant, 'id'>): Promise<Tenant> {
    const tenants = await this.getAllTenants();
    const newTenant: Tenant = {
      ...tenantData,
      id: Date.now().toString(),
    };
    tenants.push(newTenant);
    localStorage.setItem(TENANTS_STORAGE_KEY, JSON.stringify(tenants));
    return newTenant;
  },

  async updateTenant(tenantId: string, updateData: Partial<Tenant>): Promise<Tenant | null> {
    const tenants = await this.getAllTenants();
    const tenantIndex = tenants.findIndex(tenant => tenant.id === tenantId);
    if (tenantIndex === -1) return null;
    
    tenants[tenantIndex] = { ...tenants[tenantIndex], ...updateData };
    localStorage.setItem(TENANTS_STORAGE_KEY, JSON.stringify(tenants));
    return tenants[tenantIndex];
  },

  async deleteTenant(tenantId: string): Promise<boolean> {
    const tenants = await this.getAllTenants();
    const updatedTenants = tenants.filter(tenant => tenant.id !== tenantId);
    localStorage.setItem(TENANTS_STORAGE_KEY, JSON.stringify(updatedTenants));
    return updatedTenants.length < tenants.length;
  },

  async getTenantTokenData(tenantId: string): Promise<{ token: string, locationId: string, calendarId: string }> {
    const tenant = await this.getTenantById(tenantId);
    return {
      token: tenant?.apiToken || '',
      locationId: tenant?.locationId || '',
      calendarId: tenant?.calendarId || '',
    };
  },

  async updateTenantTokenData(tenantId: string, data: { token: string, locationId: string, calendarId: string }): Promise<void> {
    await this.updateTenant(tenantId, {
      apiToken: data.token,
      locationId: data.locationId,
      calendarId: data.calendarId,
    });
  },

  async getTenantServices(tenantId: string): Promise<any[]> {
    const storedServices = localStorage.getItem(`services_${tenantId}`);
    return storedServices ? JSON.parse(storedServices) : [];
  },

  async updateTenantServices(tenantId: string, services: any[]): Promise<void> {
    localStorage.setItem(`services_${tenantId}`, JSON.stringify(services));
  },

  async getTenantAvailabilitySlots(tenantId: string): Promise<any[]> {
    const storedSlots = localStorage.getItem(`availabilitySlots_${tenantId}`);
    return storedSlots ? JSON.parse(storedSlots) : [];
  },

  async updateTenantAvailabilitySlots(tenantId: string, slots: any[]): Promise<void> {
    localStorage.setItem(`availabilitySlots_${tenantId}`, JSON.stringify(slots));
  },

  async getTenantAppointments(tenantId: string): Promise<any[]> {
    const storedAppointments = localStorage.getItem(`appointments_${tenantId}`);
    return storedAppointments ? JSON.parse(storedAppointments) : [];
  },

  async updateTenantAppointments(tenantId: string, appointments: any[]): Promise<void> {
    localStorage.setItem(`appointments_${tenantId}`, JSON.stringify(appointments));
  },

  async getTenantImages(tenantId: string): Promise<any[]> {
    const storedImages = localStorage.getItem(`gallery_${tenantId}`);
    return storedImages ? JSON.parse(storedImages) : [];
  },

  async updateTenantImages(tenantId: string, images: any[]): Promise<void> {
    localStorage.setItem(`gallery_${tenantId}`, JSON.stringify(images));
  },
};