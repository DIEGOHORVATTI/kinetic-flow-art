import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Workflow, Zap, Puzzle, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-5" />
        
        <div className="relative container mx-auto px-4 py-24">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-4 text-primary font-medium">
              Visual No-Code Platform
            </Badge>
            
            <h1 className="text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent leading-tight">
              Build Workflows
              <br />
              Without Code
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Create powerful automation workflows using our intuitive drag-and-drop interface. 
              Connect services, transform data, and automate processes visually.
            </p>
            
            <div className="flex items-center justify-center gap-4">
              <Link to="/editor">
                <Button size="lg" className="bg-gradient-primary hover:opacity-90 shadow-glow">
                  Start Building
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              
              <Button variant="outline" size="lg">
                View Examples
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Why Choose Our Platform?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to make workflow automation accessible to everyone
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Workflow className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Visual Builder</h3>
            <p className="text-sm text-muted-foreground">
              Drag and drop nodes to create complex workflows without writing a single line of code.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
            <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-success" />
            </div>
            <h3 className="font-semibold mb-2">Real-time Execution</h3>
            <p className="text-sm text-muted-foreground">
              Execute workflows instantly with real-time monitoring and debugging capabilities.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
            <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center mb-4">
              <Puzzle className="w-6 h-6 text-warning" />
            </div>
            <h3 className="font-semibold mb-2">Extensible</h3>
            <p className="text-sm text-muted-foreground">
              Add custom nodes and integrations to extend functionality for your specific needs.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold mb-2">Collaborative</h3>
            <p className="text-sm text-muted-foreground">
              Share workflows with your team and collaborate in real-time on complex projects.
            </p>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-card border-y border-border">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already automating their workflows with our platform.
          </p>
          
          <Link to="/editor">
            <Button size="lg" className="bg-gradient-primary hover:opacity-90 shadow-glow">
              Launch Editor
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-muted/30 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Built with React Flow, Zustand, and modern web technologies
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
