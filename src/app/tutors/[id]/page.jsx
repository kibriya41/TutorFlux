
import { DeleteTutor } from "@/components/DeleteTutor";
import { EditTutor } from "@/components/EditTutor";
import { Star, MapPin, Clock, GraduationCap, BookOpen, Calendar, User, Mail, Phone, CheckCircle, Edit3 } from "lucide-react";
import Link from "next/link";

const TutorDetailPage = async ({ params }) => {
  const { id } = await params;

  const res = await fetch(`http://localhost:7000/tutor/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    return <div className="text-center py-20 text-xl text-gray-600">Tutor not found</div>;
  }

  const tutor = await res.json();

  // Parse institution & experience
  const [institution, experienceYears] = (tutor.institutionExperience || "Unknown,0").split(",");
  const experience = `${experienceYears} Years Experience`;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <Link href="/tutors" className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 text-sm transition-all duration-200">
          ← Back to Tutors
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">

            {/* Profile Header Card */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 
                          transition-all duration-500 hover:shadow-2xl group">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Profile Image */}
                <div className="relative flex-shrink-0">
                  <div className="w-36 h-36 md:w-44 md:h-44 rounded-3xl overflow-hidden shadow-md 
                                transition-transform duration-700 group-hover:scale-105">
                    <img
                      src={tutor.photo}
                      alt={tutor.tutorName}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow animate-pulse">
                    Available Now
                  </div>
                </div>

                {/* Tutor Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="inline-block bg-indigo-100 text-indigo-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-3 transition hover:bg-indigo-200">
                        {tutor.subject}
                      </span>
                      <h1 className="text-3xl font-bold text-gray-900">{tutor.tutorName}</h1>
                    </div>

                    {/* Edit Button */}
                    <EditTutor tutor={tutor}/>
                    <DeleteTutor tutor={tutor}/>

                  </div>

                  <div className="flex items-center gap-5 mt-4">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      <span className="font-semibold text-lg">4.8</span>
                      <span className="text-gray-500">(124 reviews)</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{experience}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-4 text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-indigo-600" />
                      <span>{institution}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-indigo-600" />
                      <span>{tutor.location}</span>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-medium px-4 py-2 rounded-2xl transition hover:scale-105">
                      <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                      {tutor.teachingMode}
                    </span>
                    <span className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 text-sm font-medium px-4 py-2 rounded-2xl transition hover:scale-105">
                      <Calendar className="w-4 h-4" />
                      {tutor.availableDays}
                    </span>
                  </div>
                </div>
              </div>

              {/* Price & Booking */}
              <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-4xl font-bold text-indigo-600">${tutor.hourlyFee}</span>
                  <span className="text-gray-500">/hour</span>
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-2xl font-semibold text-lg 
                                 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-indigo-200">
                  Book a Session
                </button>
              </div>
            </div>

            {/* About Me */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 transition-all hover:shadow-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About Me</h2>
              <p className="text-gray-600 leading-relaxed text-[17px]">
                {tutor.description}
              </p>

              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                {[
                  {
                    icon: GraduationCap,
                    color: "indigo",
                    label: "Institution",
                    value: institution
                  },
                  {
                    icon: Clock,
                    color: "emerald",
                    label: "Available Time",
                    value: tutor.availableTime
                  },
                  {
                    icon: Calendar,
                    color: "amber",
                    label: "Available Days",
                    value: tutor.availableDays
                  },
                  {
                    icon: BookOpen,
                    color: "blue",
                    label: "Total Slots",
                    value: `${tutor.totalSlot} sessions`
                  },
                  {
                    icon: CheckCircle,
                    color: "violet",
                    label: "Session Starts",
                    value: new Date(tutor.sessionStartDate).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-4 p-5 bg-gray-50 rounded-2xl group transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                    style={{ animationDelay: `${index * 80}ms` }}
                  >
                    <div className={`w-12 h-12 bg-${item.color}-100 rounded-xl flex items-center justify-center transition-transform group-hover:rotate-6`}>
                      <item.icon className={`w-6 h-6 text-${item.color}-600`} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{item.label}</p>
                      <p className="text-gray-600">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-6 transition-all hover:shadow-xl">
              <h3 className="font-semibold text-lg mb-5">Contact Information</h3>

              <div className="space-y-5">
                <div className="flex items-center gap-3 text-gray-600">
                  <User className="w-5 h-5 text-gray-400" />
                  <span>{tutor.tutorName}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span>{tutor.email || "Not provided"}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span>{tutor.phone || "+880 1XXX-XXXXXX"}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span>{tutor.location}</span>
                </div>
              </div>

              <button className="w-full mt-8 bg-gray-900 hover:bg-black text-white py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105">
                Message Tutor
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorDetailPage;