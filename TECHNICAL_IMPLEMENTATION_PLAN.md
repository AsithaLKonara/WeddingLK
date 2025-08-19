# 🔧 **TECHNICAL IMPLEMENTATION PLAN**

## 🎯 **ROLE-BASED REGISTRATION SYSTEM**

---

## 📊 **1. DATABASE SCHEMA UPDATES**

### **1.1 Enhanced User Model**
```typescript
// lib/models/user.ts
interface IUser extends Document {
  // Basic Information
  email: string;
  password?: string;
  name: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  
  // Role Management
  role: 'user' | 'vendor' | 'wedding_planner' | 'admin' | 'maintainer';
  roleVerified: boolean;
  roleVerifiedAt?: Date;
  roleVerifiedBy?: mongoose.Types.ObjectId;
  
  // Profile Information
  avatar?: string;
  bio?: string;
  location: {
    country: string;
    state: string;
    city: string;
    zipCode?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  
  // Preferences
  preferences: {
    language: string;
    currency: string;
    timezone: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    marketing: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
  
  // Social Authentication
  socialAccounts: {
    google?: {
      id: string;
      email: string;
      name: string;
      picture?: string;
    };
    facebook?: {
      id: string;
      email: string;
      name: string;
      picture?: string;
    };
    instagram?: {
      id: string;
      username: string;
      fullName: string;
      picture?: string;
    };
    linkedin?: {
      id: string;
      email: string;
      name: string;
      picture?: string;
    };
  };
  
  // Verification Status
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isIdentityVerified: boolean;
  verificationDocuments: mongoose.Types.ObjectId[];
  
  // Account Status
  status: 'active' | 'inactive' | 'suspended' | 'pending_verification';
  lastLoginAt?: Date;
  loginAttempts: number;
  lockedUntil?: Date;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastActiveAt: Date;
}
```

### **1.2 Vendor Profile Model**
```typescript
// lib/models/vendorProfile.ts
interface IVendorProfile extends Document {
  userId: mongoose.Types.ObjectId;
  
  // Business Information
  businessName: string;
  businessType: 'individual' | 'company' | 'partnership';
  businessRegistrationNumber?: string;
  taxIdentificationNumber?: string;
  businessLicenseNumber?: string;
  yearsInBusiness: number;
  
  // Service Details
  services: {
    category: string;
    subcategory: string;
    description: string;
    pricing: {
      type: 'fixed' | 'hourly' | 'package' | 'custom';
      amount: number;
      currency: string;
      unit?: string;
    };
    availability: {
      days: number[];
      hours: {
        start: string;
        end: string;
      };
      isAvailable: boolean;
    };
  }[];
  
  // Coverage Areas
  serviceAreas: {
    city: string;
    state: string;
    country: string;
    radius: number; // in kilometers
  }[];
  
  // Portfolio & Media
  portfolio: {
    title: string;
    description: string;
    images: string[];
    videos?: string[];
    category: string;
    tags: string[];
  }[];
  
  // Certifications & Licenses
  certifications: {
    name: string;
    issuingAuthority: string;
    issueDate: Date;
    expiryDate?: Date;
    documentUrl: string;
  }[];
  
  // Insurance & Liability
  insurance: {
    type: string;
    provider: string;
    policyNumber: string;
    coverageAmount: number;
    expiryDate: Date;
    documentUrl: string;
  }[];
  
  // Verification Status
  verificationStatus: 'pending' | 'verified' | 'rejected' | 'under_review';
  verificationNotes?: string;
  verifiedBy?: mongoose.Types.ObjectId;
  verifiedAt?: Date;
  
  // Business Metrics
  rating: {
    average: number;
    count: number;
    breakdown: {
      1: number;
      2: number;
      3: number;
      4: number;
      5: number;
    };
  };
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}
```

### **1.3 Wedding Planner Profile Model**
```typescript
// lib/models/weddingPlannerProfile.ts
interface IWeddingPlannerProfile extends Document {
  userId: mongoose.Types.ObjectId;
  
  // Professional Information
  professionalTitle: string;
  yearsOfExperience: number;
  specialization: string[];
  languages: string[];
  
  // Education & Certifications
  education: {
    degree: string;
    institution: string;
    year: number;
    documentUrl?: string;
  }[];
  
  certifications: {
    name: string;
    issuingAuthority: string;
    issueDate: Date;
    expiryDate?: Date;
    documentUrl: string;
  }[];
  
  // Professional Memberships
  memberships: {
    organization: string;
    membershipType: string;
    memberSince: Date;
    memberId: string;
  }[];
  
  // Portfolio
  portfolio: {
    title: string;
    description: string;
    weddingDate: Date;
    guestCount: number;
    budget: number;
    images: string[];
    clientTestimonial?: string;
    category: string[];
  }[];
  
  // Services Offered
  services: {
    name: string;
    description: string;
    pricing: {
      type: 'fixed' | 'percentage' | 'hourly';
      amount: number;
      currency: string;
    };
    isAvailable: boolean;
  }[];
  
  // Service Areas
  serviceAreas: {
    city: string;
    state: string;
    country: string;
    travelRadius: number;
    travelFee?: number;
  }[];
  
  // Insurance & Liability
  professionalLiability: {
    provider: string;
    policyNumber: string;
    coverageAmount: number;
    expiryDate: Date;
    documentUrl: string;
  };
  
  // Verification Status
  verificationStatus: 'pending' | 'verified' | 'rejected' | 'under_review';
  verificationNotes?: string;
  verifiedBy?: mongoose.Types.ObjectId;
  verifiedAt?: Date;
  
  // Business Metrics
  rating: {
    average: number;
    count: number;
  };
  completedWeddings: number;
  averageWeddingBudget: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🔐 **2. AUTHENTICATION SYSTEM UPDATES**

### **2.1 NextAuth.js Configuration**
```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import InstagramProvider from 'next-auth/providers/instagram';
import LinkedInProvider from 'next-auth/providers/linkedin';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
  providers: [
    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid email profile',
        },
      },
    }),
    
    // Facebook OAuth
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    
    // Instagram OAuth
    InstagramProvider({
      clientId: process.env.INSTAGRAM_CLIENT_ID!,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET!,
    }),
    
    // LinkedIn OAuth
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
    }),
    
    // Traditional credentials
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Implement credential validation
        return null;
      },
    }),
  ],
  
  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle social login
      if (account?.provider !== 'credentials') {
        return await handleSocialLogin(user, account, profile);
      }
      return true;
    },
    
    async jwt({ token, user, account }) {
      // Add custom claims to JWT
      if (user) {
        token.role = user.role;
        token.userId = user.id;
      }
      return token;
    },
    
    async session({ session, token }) {
      // Add custom data to session
      session.user.role = token.role;
      session.user.id = token.userId;
      return session;
    },
  },
  
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },
  
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
};

export default NextAuth(authOptions);
```

### **2.2 Social Login Handler**
```typescript
// lib/auth/social-login-handler.ts
export async function handleSocialLogin(user: any, account: any, profile: any) {
  try {
    const { email, name, picture } = profile;
    
    // Check if user exists
    let existingUser = await User.findOne({ email });
    
    if (existingUser) {
      // Link social account to existing user
      await linkSocialAccount(existingUser._id, account.provider, profile);
      return true;
    } else {
      // Create new user with social account
      const newUser = await createUserFromSocialLogin(profile, account.provider);
      return true;
    }
  } catch (error) {
    console.error('Social login error:', error);
    return false;
  }
}

async function createUserFromSocialLogin(profile: any, provider: string) {
  const userData = {
    email: profile.email,
    name: profile.name,
    avatar: profile.picture,
    role: 'user', // Default role
    isEmailVerified: true, // Social accounts are pre-verified
    socialAccounts: {
      [provider]: {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        picture: profile.picture,
      },
    },
  };
  
  const user = new User(userData);
  await user.save();
  
  return user;
}

async function linkSocialAccount(userId: string, provider: string, profile: any) {
  const updateData = {
    [`socialAccounts.${provider}`]: {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      picture: profile.picture,
    },
  };
  
  await User.findByIdAndUpdate(userId, updateData);
}
```

---

## 🎨 **3. FRONTEND COMPONENTS**

### **3.1 Role Selection Component**
```typescript
// components/auth/role-selection.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface RoleOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  requirements: string[];
}

const roleOptions: RoleOption[] = [
  {
    id: 'user',
    title: 'Wedding Couple',
    description: 'Plan your perfect wedding with our platform',
    icon: '💒',
    features: [
      'Find vendors and venues',
      'Plan your wedding timeline',
      'Manage your budget',
      'Get personalized recommendations'
    ],
    requirements: [
      'Valid email address',
      'Basic personal information'
    ]
  },
  {
    id: 'vendor',
    title: 'Vendor/Service Provider',
    description: 'Showcase your services to couples planning weddings',
    icon: '🏢',
    features: [
      'Create business profile',
      'Showcase your portfolio',
      'Receive booking requests',
      'Manage your services'
    ],
    requirements: [
      'Business registration',
      'Professional certifications',
      'Portfolio samples',
      'Insurance documentation'
    ]
  },
  {
    id: 'wedding_planner',
    title: 'Wedding Planner',
    description: 'Professional wedding planning services',
    icon: '📋',
    features: [
      'Professional profile',
      'Portfolio showcase',
      'Client management',
      'Service packages'
    ],
    requirements: [
      'Professional certification',
      'Portfolio of work',
      'Business registration',
      'Professional liability insurance'
    ]
  }
];

export function RoleSelection({ onRoleSelect }: { onRoleSelect: (role: string) => void }) {
  const [selectedRole, setSelectedRole] = useState<string>('');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold">Choose Your Role</h2>
        <p className="text-muted-foreground mt-2">
          Select the role that best describes how you'll use WeddingLK
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {roleOptions.map((role) => (
          <Card 
            key={role.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedRole === role.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedRole(role.id)}
          >
            <CardHeader className="text-center">
              <div className="text-4xl mb-2">{role.icon}</div>
              <CardTitle>{role.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {role.description}
              </p>
              
              <div>
                <h4 className="font-semibold mb-2">Key Features:</h4>
                <ul className="space-y-1 text-sm">
                  {role.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Requirements:</h4>
                <ul className="space-y-1 text-sm">
                  {role.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-center">
                      <span className="text-blue-500 mr-2">ℹ</span>
                      {requirement}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-center">
        <Button 
          size="lg" 
          disabled={!selectedRole}
          onClick={() => onRoleSelect(selectedRole)}
        >
          Continue with {selectedRole ? roleOptions.find(r => r.id === selectedRole)?.title : 'Role'}
        </Button>
      </div>
    </div>
  );
}
```

### **3.2 Dynamic Registration Form**
```typescript
// components/auth/dynamic-registration-form.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { FileUpload } from '@/components/ui/file-upload';

interface RegistrationFormProps {
  role: string;
  onSubmit: (data: any) => void;
}

export function DynamicRegistrationForm({ role, onSubmit }: RegistrationFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  
  const formConfig = getFormConfig(role);
  const currentStepConfig = formConfig.steps[currentStep];
  
  const form = useForm({
    resolver: zodResolver(currentStepConfig.schema),
    defaultValues: currentStepConfig.defaultValues,
  });
  
  const handleStepSubmit = async (data: any) => {
    const updatedData = { ...formData, ...data };
    setFormData(updatedData);
    
    if (currentStep < formConfig.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onSubmit(updatedData);
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Step {currentStep + 1} of {formConfig.steps.length}</span>
          <span>{Math.round(((currentStep + 1) / formConfig.steps.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / formConfig.steps.length) * 100}%` }}
          />
        </div>
      </div>
      
      {/* Step Title */}
      <div className="text-center">
        <h2 className="text-2xl font-bold">{currentStepConfig.title}</h2>
        <p className="text-muted-foreground">{currentStepConfig.description}</p>
      </div>
      
      {/* Form Fields */}
      <form onSubmit={form.handleSubmit(handleStepSubmit)} className="space-y-4">
        {currentStepConfig.fields.map((field) => (
          <div key={field.name} className="space-y-2">
            <label className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            
            {renderField(field, form)}
            
            {field.description && (
              <p className="text-xs text-muted-foreground">{field.description}</p>
            )}
          </div>
        ))}
        
        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          
          <Button type="submit">
            {currentStep === formConfig.steps.length - 1 ? 'Complete Registration' : 'Next'}
          </Button>
        </div>
      </form>
    </div>
  );
}

function renderField(field: any, form: any) {
  switch (field.type) {
    case 'text':
    case 'email':
    case 'tel':
      return (
        <Input
          type={field.type}
          {...form.register(field.name)}
          placeholder={field.placeholder}
        />
      );
      
    case 'textarea':
      return (
        <Textarea
          {...form.register(field.name)}
          placeholder={field.placeholder}
          rows={field.rows || 3}
        />
      );
      
    case 'select':
      return (
        <Select onValueChange={(value) => form.setValue(field.name, value)}>
          <SelectTrigger>
            <SelectValue placeholder={field.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {field.options.map((option: any) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
      
    case 'checkbox':
      return (
        <Checkbox
          checked={form.watch(field.name)}
          onCheckedChange={(checked) => form.setValue(field.name, checked)}
        />
      );
      
    case 'file':
      return (
        <FileUpload
          accept={field.accept}
          multiple={field.multiple}
          onUpload={(files) => form.setValue(field.name, files)}
        />
      );
      
    default:
      return <Input {...form.register(field.name)} />;
  }
}
```

---

## 🚀 **4. API ENDPOINTS**

### **4.1 Registration API**
```typescript
// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';
import { VendorProfile } from '@/lib/models/vendorProfile';
import { WeddingPlannerProfile } from '@/lib/models/weddingPlannerProfile';
import { hashPassword, validatePassword } from '@/lib/auth/password-utils';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { role, ...userData } = body;
    
    // Validate role
    const validRoles = ['user', 'vendor', 'wedding_planner'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role specified' },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }
    
    // Hash password if provided
    if (userData.password) {
      const passwordValidation = validatePassword(userData.password);
      if (!passwordValidation.isValid) {
        return NextResponse.json(
          { error: 'Password does not meet requirements', details: passwordValidation.errors },
          { status: 400 }
        );
      }
      userData.password = await hashPassword(userData.password);
    }
    
    // Create user
    const user = new User({
      ...userData,
      role,
      status: 'pending_verification',
      isEmailVerified: false,
    });
    
    await user.save();
    
    // Create role-specific profile
    if (role === 'vendor') {
      const vendorProfile = new VendorProfile({
        userId: user._id,
        verificationStatus: 'pending',
      });
      await vendorProfile.save();
    } else if (role === 'wedding_planner') {
      const plannerProfile = new WeddingPlannerProfile({
        userId: user._id,
        verificationStatus: 'pending',
      });
      await plannerProfile.save();
    }
    
    // Send verification email
    if (userData.email) {
      await sendVerificationEmail(userData.email, user._id.toString());
    }
    
    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
      userId: user._id,
      role: user.role,
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed', message: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### **4.2 Social Login API**
```typescript
// app/api/auth/social-login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';
import { verifySocialToken } from '@/lib/auth/social-auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { provider, token, role } = body;
    
    // Verify social token
    const profile = await verifySocialToken(provider, token);
    if (!profile) {
      return NextResponse.json(
        { error: 'Invalid social token' },
        { status: 401 }
      );
    }
    
    // Check if user exists
    let user = await User.findOne({ email: profile.email });
    
    if (user) {
      // Link social account to existing user
      await linkSocialAccount(user._id, provider, profile);
    } else {
      // Create new user
      user = await createUserFromSocialLogin(profile, provider, role);
    }
    
    // Generate JWT token
    const jwtToken = generateJWT(user);
    
    return NextResponse.json({
      success: true,
      token: jwtToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
    
  } catch (error) {
    console.error('Social login error:', error);
    return NextResponse.json(
      { error: 'Social login failed', message: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

## 🔒 **5. SECURITY & VALIDATION**

### **5.1 Password Validation**
```typescript
// lib/auth/password-utils.ts
export function validatePassword(password: string) {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

export async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import('bcryptjs');
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  const bcrypt = await import('bcryptjs');
  return bcrypt.compare(password, hash);
}
```

### **5.2 Input Validation**
```typescript
// lib/validation/registration-schemas.ts
import { z } from 'zod';

export const userRegistrationSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  dateOfBirth: z.date().optional(),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional(),
  location: z.object({
    country: z.string().min(2, 'Country is required'),
    state: z.string().min(2, 'State is required'),
    city: z.string().min(2, 'City is required'),
    zipCode: z.string().optional(),
  }),
  preferences: z.object({
    language: z.string().default('en'),
    currency: z.string().default('USD'),
    timezone: z.string().default('UTC'),
    notifications: z.object({
      email: z.boolean().default(true),
      sms: z.boolean().default(false),
      push: z.boolean().default(true),
    }),
    marketing: z.object({
      email: z.boolean().default(false),
      sms: z.boolean().default(false),
      push: z.boolean().default(false),
    }),
  }),
});

export const vendorRegistrationSchema = userRegistrationSchema.extend({
  businessName: z.string().min(2, 'Business name is required'),
  businessType: z.enum(['individual', 'company', 'partnership']),
  businessRegistrationNumber: z.string().optional(),
  taxIdentificationNumber: z.string().optional(),
  yearsInBusiness: z.number().min(0, 'Years in business must be positive'),
  services: z.array(z.object({
    category: z.string().min(1, 'Service category is required'),
    subcategory: z.string().optional(),
    description: z.string().min(10, 'Service description must be at least 10 characters'),
    pricing: z.object({
      type: z.enum(['fixed', 'hourly', 'package', 'custom']),
      amount: z.number().positive('Amount must be positive'),
      currency: z.string().default('USD'),
      unit: z.string().optional(),
    }),
  })).min(1, 'At least one service is required'),
});

export const weddingPlannerRegistrationSchema = userRegistrationSchema.extend({
  professionalTitle: z.string().min(2, 'Professional title is required'),
  yearsOfExperience: z.number().min(0, 'Years of experience must be positive'),
  specialization: z.array(z.string()).min(1, 'At least one specialization is required'),
  languages: z.array(z.string()).min(1, 'At least one language is required'),
  education: z.array(z.object({
    degree: z.string().min(1, 'Degree is required'),
    institution: z.string().min(1, 'Institution is required'),
    year: z.number().min(1900, 'Invalid year'),
  })).optional(),
});
```

---

## 📱 **6. MOBILE APP INTEGRATION**

### **6.1 React Native Registration**
```typescript
// mobile-app/src/screens/RegistrationScreen.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { TextInput, Button, Card } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';

export function RegistrationScreen({ navigation }: any) {
  const [role, setRole] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  
  const roles = [
    { label: 'Wedding Couple', value: 'user' },
    { label: 'Vendor/Service Provider', value: 'vendor' },
    { label: 'Wedding Planner', value: 'wedding_planner' },
  ];
  
  const handleRoleSelect = (selectedRole: string) => {
    setRole(selectedRole);
    setCurrentStep(1);
  };
  
  const handleSubmit = async () => {
    try {
      // Submit registration data
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role }),
      });
      
      if (response.ok) {
        navigation.navigate('Verification');
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      {currentStep === 0 && (
        <View style={styles.roleSelection}>
          <Text style={styles.title}>Choose Your Role</Text>
          <Text style={styles.subtitle}>
            Select how you'll use WeddingLK
          </Text>
          
          {roles.map((roleOption) => (
            <Card
              key={roleOption.value}
              style={styles.roleCard}
              onPress={() => handleRoleSelect(roleOption.value)}
            >
              <Card.Content>
                <Text style={styles.roleTitle}>{roleOption.label}</Text>
              </Card.Content>
            </Card>
          ))}
        </View>
      )}
      
      {currentStep === 1 && (
        <View style={styles.registrationForm}>
          <Text style={styles.title}>Complete Your Profile</Text>
          {/* Render role-specific form fields */}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  roleSelection: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  roleCard: {
    marginBottom: 15,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  registrationForm: {
    padding: 20,
  },
});
```

---

## 🚀 **7. DEPLOYMENT & TESTING**

### **7.1 Testing Strategy**
- [ ] **Unit Tests**: Individual component and function testing
- [ ] **Integration Tests**: API endpoint and database testing
- [ ] **E2E Tests**: Complete user flow testing
- [ ] **Security Tests**: Authentication and authorization testing
- [ ] **Performance Tests**: Load and stress testing

### **7.2 Deployment Checklist**
- [ ] **Environment Variables**: All secrets and configuration
- [ ] **Database Migration**: Schema updates and data migration
- [ ] **File Storage**: Cloud storage configuration
- [ ] **SSL Certificates**: HTTPS configuration
- [ ] **Monitoring**: Error tracking and performance monitoring
- [ ] **Backup**: Database and file backup configuration

---

## 📈 **8. SUCCESS METRICS**

### **8.1 Technical Metrics**
- Registration form completion rate > 90%
- Social login success rate > 95%
- API response time < 500ms
- Zero critical security vulnerabilities

### **8.2 Business Metrics**
- User registration conversion > 80%
- Role distribution balance
- Verification completion rate > 85%
- User engagement post-registration > 70%

---

## 🎯 **NEXT STEPS**

1. **Review and approve** this technical implementation plan
2. **Set up development environment** with required dependencies
3. **Begin database schema updates** and model creation
4. **Implement authentication system** with social login
5. **Create frontend components** for registration forms
6. **Develop API endpoints** for user management
7. **Integrate mobile app** registration flow
8. **Implement testing** and validation
9. **Deploy and monitor** the new system

This implementation plan provides a comprehensive roadmap for building a robust, secure, and user-friendly role-based registration system with social authentication integration. 